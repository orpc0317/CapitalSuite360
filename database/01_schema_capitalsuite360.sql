-- =============================================================================
-- CapitalSuite360 - Esquema de Base de Datos
-- Motor: Supabase (PostgreSQL)
-- Versión: 1.0.0
-- Fecha: 2026-03-22
-- =============================================================================
--
-- NOTAS IMPORTANTES:
--   1. Todos los campos userid, usuario_agrego y usuario_modifico son de tipo
--      UUID y referencian auth.users(id) de Supabase Auth.
--   2. El campo contrasena fue eliminado de t_usuario ya que la autenticación
--      es manejada completamente por Supabase Auth.
--   3. Se agrega t_grupo_economico para soportar la estructura multi-empresa
--      del esquema SaaS (Grupo → Empresa → Proyecto).
--   4. Se agrega t_grupo_usuario para permitir acceso multi-empresa a usuarios
--      que pertenecen a un Grupo Económico.
--   5. Se eliminaron: sysdiagrams (específica de SQL Server) y
--      t_parametro_general (específica de la aplicación de escritorio).
--   6. Se reemplaza t_oficina con el concepto de Proyecto (ya existente).
--
-- EJECUCIÓN: Correr este script en el SQL Editor de Supabase.
-- =============================================================================

-- Crear el esquema y establecerlo como ruta de búsqueda
CREATE SCHEMA IF NOT EXISTS capitalsuite360;
SET search_path TO capitalsuite360;


-- =============================================================================
-- 1. TABLAS DE REFERENCIA GEOGRÁFICA (Guatemala)
-- =============================================================================

CREATE TABLE t_departamentos_guatemala (
    codigo        VARCHAR(3)    NOT NULL,
    nombre        VARCHAR(40)   NOT NULL,
    igss_laboral  NUMERIC(18,8) NOT NULL DEFAULT 0,
    igss_patronal NUMERIC(18,8) NOT NULL DEFAULT 0,
    tasa_intecap  NUMERIC(18,8) NOT NULL DEFAULT 0,
    tasa_irtra    NUMERIC(18,8) NOT NULL DEFAULT 0,
    municipio     INTEGER       NOT NULL DEFAULT 0,
    CONSTRAINT pk_departamentos_guatemala PRIMARY KEY (codigo)
);

COMMENT ON TABLE t_departamentos_guatemala IS 'Catálogo de departamentos de Guatemala con tasas de retención.';

-- -----------------------------------------------------------------------------

CREATE TABLE t_municipios_guatemala (
    departamento VARCHAR(3)  NOT NULL,
    codigo       INTEGER     NOT NULL DEFAULT 0,
    nombre       VARCHAR(40) NOT NULL,
    CONSTRAINT pk_municipios_guatemala PRIMARY KEY (departamento, codigo),
    CONSTRAINT fk_municipio_depto FOREIGN KEY (departamento)
        REFERENCES t_departamentos_guatemala (codigo)
);

COMMENT ON TABLE t_municipios_guatemala IS 'Catálogo de municipios de Guatemala.';


-- =============================================================================
-- 2. MONEDA
-- =============================================================================

CREATE TABLE t_moneda (
    codigo           INTEGER       NOT NULL DEFAULT 0,
    nombre           VARCHAR(40)   NOT NULL,
    simbolo          VARCHAR(5)    NOT NULL,
    tasa_cambio      NUMERIC(18,8) NOT NULL DEFAULT 0,
    usuario_agrego   UUID          NOT NULL REFERENCES auth.users (id),
    fecha_agrego     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    usuario_modifico UUID          NOT NULL REFERENCES auth.users (id),
    fecha_modifico   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_moneda PRIMARY KEY (codigo)
);

COMMENT ON TABLE t_moneda IS 'Catálogo de monedas y tasas de cambio.';


-- =============================================================================
-- 3. USUARIO (perfil complementario al registro de auth.users de Supabase)
-- =============================================================================

CREATE TABLE t_usuario (
    userid           UUID        NOT NULL REFERENCES auth.users (id),
    nombres          VARCHAR(30) NOT NULL,
    apellidos        VARCHAR(30) NOT NULL,
    -- La contraseña NO se almacena aquí; es gestionada por Supabase Auth
    activo           SMALLINT    NOT NULL DEFAULT 1,
    usuario_agrego   UUID        NOT NULL REFERENCES auth.users (id),
    fecha_agrego     TIMESTAMPTZ NOT NULL DEFAULT now(),
    usuario_modifico UUID        NOT NULL REFERENCES auth.users (id),
    fecha_modifico   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_usuario PRIMARY KEY (userid)
);

COMMENT ON TABLE t_usuario IS 'Perfil de usuario complementario. La autenticación es manejada por Supabase Auth.';
COMMENT ON COLUMN t_usuario.activo IS '1 = activo, 0 = inactivo.';


-- =============================================================================
-- 4. MENÚ DEL SISTEMA
-- =============================================================================

CREATE TABLE t_menu (
    indice        VARCHAR(8)  NOT NULL,
    menu_array    VARCHAR(20) NOT NULL,
    pantalla      VARCHAR(20),
    nombre        VARCHAR(40) NOT NULL,
    tipo_pantalla SMALLINT    NOT NULL DEFAULT 0,
    mantenimiento SMALLINT    NOT NULL DEFAULT 0,
    agregar       SMALLINT    NOT NULL DEFAULT 0,
    modificar     SMALLINT    NOT NULL DEFAULT 0,
    eliminar      SMALLINT    NOT NULL DEFAULT 0,
    consultar     SMALLINT    NOT NULL DEFAULT 0,
    CONSTRAINT pk_menu PRIMARY KEY (indice)
);

COMMENT ON TABLE t_menu IS 'Definición del menú del sistema y sus permisos por defecto.';


-- =============================================================================
-- 5. GRUPO ECONÓMICO (nueva tabla - núcleo del modelo multi-empresa SaaS)
-- =============================================================================

CREATE TABLE t_grupo_economico (
    id               UUID         NOT NULL DEFAULT gen_random_uuid(),
    nombre           VARCHAR(100) NOT NULL,
    descripcion      VARCHAR(255),
    activo           SMALLINT     NOT NULL DEFAULT 1,
    usuario_agrego   UUID         NOT NULL REFERENCES auth.users (id),
    fecha_agrego     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    usuario_modifico UUID         NOT NULL REFERENCES auth.users (id),
    fecha_modifico   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT pk_grupo_economico PRIMARY KEY (id)
);

COMMENT ON TABLE t_grupo_economico IS 'Grupos económicos que pueden integrar una o varias empresas. Nivel más alto del modelo multi-tenant.';


-- =============================================================================
-- 6. EMPRESA
-- =============================================================================

CREATE TABLE t_empresa (
    codigo                  INTEGER      NOT NULL DEFAULT 0,
    grupo_economico         UUID         REFERENCES t_grupo_economico (id),
    nombre                  VARCHAR(40)  NOT NULL,
    razon_social            VARCHAR(40)  NOT NULL,
    direccion               VARCHAR(150) NOT NULL,
    pais                    VARCHAR(2),
    departamento            VARCHAR(3),
    municipio               INTEGER      NOT NULL DEFAULT 0,
    codigo_postal           VARCHAR(10),
    nit                     VARCHAR(20)  NOT NULL,
    numero_patronal         VARCHAR(20),
    patente_comercio        VARCHAR(20),
    patente_sociedad        VARCHAR(20),
    telefono                VARCHAR(15),
    fax                     VARCHAR(15),
    representante           VARCHAR(40),
    contador                VARCHAR(40),
    numero_colegiado        VARCHAR(15),
    retenedor_iva           SMALLINT     NOT NULL DEFAULT 0,
    regimen_isr             VARCHAR(15),
    regimen_isr_tipo        SMALLINT,
    regimen_isr_resolucion  VARCHAR(20),
    regimen_isr_fecha       DATE,
    usuario_agrego          UUID         NOT NULL REFERENCES auth.users (id),
    fecha_agrego            TIMESTAMPTZ  NOT NULL DEFAULT now(),
    usuario_modifico        UUID         NOT NULL REFERENCES auth.users (id),
    fecha_modifico          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT pk_empresa PRIMARY KEY (codigo)
);

COMMENT ON TABLE t_empresa IS 'Empresas de lotificación. Pueden pertenecer a un grupo económico.';
COMMENT ON COLUMN t_empresa.grupo_economico IS 'FK opcional al grupo económico al que pertenece la empresa.';


-- =============================================================================
-- 7. EMPRESA - USUARIO (acceso de usuarios a empresas específicas)
-- =============================================================================

CREATE TABLE t_empresa_usuario (
    userid  UUID    NOT NULL REFERENCES auth.users (id),
    empresa INTEGER NOT NULL REFERENCES t_empresa (codigo),
    CONSTRAINT pk_empresa_usuario PRIMARY KEY (userid, empresa)
);

COMMENT ON TABLE t_empresa_usuario IS 'Relación entre usuarios y las empresas a las que tienen acceso.';


-- =============================================================================
-- 8. GRUPO ECONÓMICO - USUARIO (acceso a múltiples empresas vía grupo)
-- =============================================================================

CREATE TABLE t_grupo_usuario (
    userid          UUID NOT NULL REFERENCES auth.users (id),
    grupo_economico UUID NOT NULL REFERENCES t_grupo_economico (id),
    CONSTRAINT pk_grupo_usuario PRIMARY KEY (userid, grupo_economico)
);

COMMENT ON TABLE t_grupo_usuario IS 'Usuarios con acceso a nivel de grupo económico (pueden ver todos los proyectos del grupo).';


-- =============================================================================
-- 9. BANCO
-- =============================================================================

CREATE TABLE t_banco (
    codigo           INTEGER     NOT NULL DEFAULT 0,
    nombre           VARCHAR(40) NOT NULL,
    usuario_agrego   UUID        NOT NULL REFERENCES auth.users (id),
    fecha_agrego     TIMESTAMPTZ NOT NULL DEFAULT now(),
    usuario_modifico UUID        NOT NULL REFERENCES auth.users (id),
    fecha_modifico   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_banco PRIMARY KEY (codigo)
);

COMMENT ON TABLE t_banco IS 'Catálogo de bancos del sistema financiero.';


-- =============================================================================
-- 10. PROYECTO
-- =============================================================================

CREATE TABLE t_proyecto (
    empresa                        INTEGER       NOT NULL DEFAULT 0,
    codigo                         INTEGER       NOT NULL DEFAULT 0,
    nombre                         VARCHAR(40)   NOT NULL,
    ubicacion                      VARCHAR(150),
    telefono1                      VARCHAR(15),
    telefono2                      VARCHAR(15),
    fax                            VARCHAR(15),
    mora_automatica                SMALLINT      NOT NULL DEFAULT 0,
    fijar_parametros_mora          SMALLINT      NOT NULL DEFAULT 0,
    forma_mora                     SMALLINT      NOT NULL DEFAULT 0,
    interes_mora                   NUMERIC(18,8) NOT NULL DEFAULT 0,
    fijo_mora                      NUMERIC(18,8) NOT NULL DEFAULT 0,
    mora_enganche                  SMALLINT      NOT NULL DEFAULT 0,
    dias_gracia                    INTEGER       NOT NULL DEFAULT 0,
    dias_afectos                   INTEGER       NOT NULL DEFAULT 0,
    inicio_calculo_mora            DATE,
    calcular_mora_antes            SMALLINT      NOT NULL DEFAULT 0,
    minimo_mora                    NUMERIC(18,2) NOT NULL DEFAULT 0,
    minimo_abono_capital           NUMERIC(18,2) NOT NULL DEFAULT 0,
    inicio_abono_capital_estricto  DATE,
    mes_facturacion                DATE,
    promesa_vencida                INTEGER       NOT NULL DEFAULT 0,
    correlativo_promesa            INTEGER       NOT NULL DEFAULT 0,
    correlativo_cliente            INTEGER       NOT NULL DEFAULT 0,
    correlativo_fase               INTEGER       NOT NULL DEFAULT 0,
    correlativo_supervisor         INTEGER       NOT NULL DEFAULT 0,
    correlativo_coordinador        INTEGER       NOT NULL DEFAULT 0,
    correlativo_vendedor           INTEGER       NOT NULL DEFAULT 0,
    correlativo_cobrador           INTEGER       NOT NULL DEFAULT 0,
    otros_ingresos                 SMALLINT      NOT NULL DEFAULT 0,
    usuario_agrego                 UUID          NOT NULL REFERENCES auth.users (id),
    fecha_agrego                   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    usuario_modifico               UUID          NOT NULL REFERENCES auth.users (id),
    fecha_modifico                 TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_proyecto PRIMARY KEY (empresa, codigo),
    CONSTRAINT fk_proyecto_empresa FOREIGN KEY (empresa)
        REFERENCES t_empresa (codigo)
);

COMMENT ON TABLE t_proyecto IS 'Proyectos de lotificación. Cada empresa puede tener uno o más proyectos.';
COMMENT ON COLUMN t_proyecto.correlativo_promesa IS 'Último número correlativo usado para promesas de este proyecto.';


-- =============================================================================
-- 11. FASE (etapas o sectores de un proyecto)
-- =============================================================================

CREATE TABLE t_fase (
    empresa          INTEGER     NOT NULL DEFAULT 0,
    proyecto         INTEGER     NOT NULL DEFAULT 0,
    codigo           INTEGER     NOT NULL DEFAULT 0,
    nombre           VARCHAR(40) NOT NULL,
    medida           VARCHAR(5)  NOT NULL,
    usuario_agrego   UUID        NOT NULL REFERENCES auth.users (id),
    fecha_agrego     TIMESTAMPTZ NOT NULL DEFAULT now(),
    usuario_modifico UUID        NOT NULL REFERENCES auth.users (id),
    fecha_modifico   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_fase PRIMARY KEY (empresa, proyecto, codigo),
    CONSTRAINT fk_fase_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo)
);

COMMENT ON TABLE t_fase IS 'Fases o etapas de un proyecto de lotificación (ej: Fase 1, Sector A).';
COMMENT ON COLUMN t_fase.medida IS 'Unidad de medida de extensión (ej: varas², m²).';


-- =============================================================================
-- 12. MANZANA (subdivisión dentro de una fase)
-- =============================================================================

CREATE TABLE t_manzana (
    empresa          INTEGER     NOT NULL DEFAULT 0,
    proyecto         INTEGER     NOT NULL DEFAULT 0,
    fase             INTEGER     NOT NULL DEFAULT 0,
    codigo           VARCHAR(5)  NOT NULL,
    usuario_agrego   UUID        NOT NULL REFERENCES auth.users (id),
    fecha_agrego     TIMESTAMPTZ NOT NULL DEFAULT now(),
    usuario_modifico UUID        NOT NULL REFERENCES auth.users (id),
    fecha_modifico   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_manzana PRIMARY KEY (empresa, proyecto, fase, codigo),
    CONSTRAINT fk_manzana_fase FOREIGN KEY (empresa, proyecto, fase)
        REFERENCES t_fase (empresa, proyecto, codigo)
);

COMMENT ON TABLE t_manzana IS 'Manzanas dentro de una fase del proyecto.';


-- =============================================================================
-- 13. LOTE (unidad mínima vendible del proyecto)
-- =============================================================================

CREATE TABLE t_lote (
    empresa          INTEGER       NOT NULL DEFAULT 0,
    proyecto         INTEGER       NOT NULL DEFAULT 0,
    fase             INTEGER       NOT NULL DEFAULT 0,
    manzana          VARCHAR(5)    NOT NULL,
    numero           VARCHAR(5)    NOT NULL,
    moneda           INTEGER       NOT NULL DEFAULT 0,
    valor            NUMERIC(18,2) NOT NULL DEFAULT 0,
    finca            VARCHAR(15),
    folio            VARCHAR(15),
    libro            VARCHAR(15),
    departamento     VARCHAR(3),
    municipio        INTEGER       NOT NULL DEFAULT 0,
    norte            VARCHAR(15),
    sur              VARCHAR(15),
    este             VARCHAR(15),
    oeste            VARCHAR(15),
    otro             VARCHAR(15),
    extension        NUMERIC(18,2) NOT NULL DEFAULT 0,
    promesa          INTEGER       NOT NULL DEFAULT 0,
    serie            VARCHAR(3),
    recibo           INTEGER       NOT NULL DEFAULT 0,
    usuario_agrego   UUID          NOT NULL REFERENCES auth.users (id),
    fecha_agrego     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    usuario_modifico UUID          NOT NULL REFERENCES auth.users (id),
    fecha_modifico   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_lote PRIMARY KEY (empresa, proyecto, fase, manzana, numero),
    CONSTRAINT fk_lote_manzana FOREIGN KEY (empresa, proyecto, fase, manzana)
        REFERENCES t_manzana (empresa, proyecto, fase, codigo),
    CONSTRAINT fk_lote_moneda FOREIGN KEY (moneda)
        REFERENCES t_moneda (codigo)
);

COMMENT ON TABLE t_lote IS 'Lotes individuales del proyecto. Contiene datos registrales y el estado de venta.';
COMMENT ON COLUMN t_lote.promesa IS '0 = disponible; > 0 = número de promesa que lo reservó.';
COMMENT ON COLUMN t_lote.extension IS 'Área del lote en la unidad definida en t_fase.medida.';


-- =============================================================================
-- 14. CLIENTE
-- =============================================================================

CREATE TABLE t_cliente (
    empresa          INTEGER      NOT NULL DEFAULT 0,
    proyecto         INTEGER      NOT NULL DEFAULT 0,
    codigo           INTEGER      NOT NULL DEFAULT 0,
    nombre           VARCHAR(100) NOT NULL,
    numero_orden     VARCHAR(3),
    numero_registro  VARCHAR(15),
    extendida_en     INTEGER      NOT NULL DEFAULT 0,
    direccion        VARCHAR(150),
    telefono1        VARCHAR(15),
    telefono2        VARCHAR(15),
    fax              VARCHAR(15),
    correo           VARCHAR(50),
    nombre_factura   VARCHAR(100) NOT NULL,
    nit              VARCHAR(20)  NOT NULL,
    regimen_iva      SMALLINT     NOT NULL DEFAULT 0,
    usuario_agrego   UUID         NOT NULL REFERENCES auth.users (id),
    fecha_agrego     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    usuario_modifico UUID         NOT NULL REFERENCES auth.users (id),
    fecha_modifico   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT pk_cliente PRIMARY KEY (empresa, proyecto, codigo),
    CONSTRAINT fk_cliente_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo)
);

COMMENT ON TABLE t_cliente IS 'Compradores de lotes. El correo se usa para darles acceso al portal de clientes.';


-- =============================================================================
-- 15. SUPERVISOR
-- =============================================================================

CREATE TABLE t_supervisor (
    empresa          INTEGER       NOT NULL DEFAULT 0,
    proyecto         INTEGER       NOT NULL DEFAULT 0,
    codigo           INTEGER       NOT NULL DEFAULT 0,
    nombre           VARCHAR(40)   NOT NULL,
    isr              NUMERIC(18,8) NOT NULL DEFAULT 0,
    usuario_agrego   UUID          NOT NULL REFERENCES auth.users (id),
    fecha_agrego     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    usuario_modifico UUID          NOT NULL REFERENCES auth.users (id),
    fecha_modifico   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_supervisor PRIMARY KEY (empresa, proyecto, codigo),
    CONSTRAINT fk_supervisor_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo)
);

COMMENT ON TABLE t_supervisor IS 'Supervisores de ventas por proyecto.';
COMMENT ON COLUMN t_supervisor.isr IS 'Porcentaje de retención ISR aplicable al supervisor.';


-- =============================================================================
-- 16. COORDINADOR
-- =============================================================================

CREATE TABLE t_coordinador (
    empresa          INTEGER       NOT NULL DEFAULT 0,
    proyecto         INTEGER       NOT NULL DEFAULT 0,
    codigo           INTEGER       NOT NULL DEFAULT 0,
    nombre           VARCHAR(40)   NOT NULL,
    isr              NUMERIC(18,8) NOT NULL DEFAULT 0,
    supervisor       INTEGER       NOT NULL DEFAULT 0,
    usuario_agrego   UUID          NOT NULL REFERENCES auth.users (id),
    fecha_agrego     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    usuario_modifico UUID          NOT NULL REFERENCES auth.users (id),
    fecha_modifico   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_coordinador PRIMARY KEY (empresa, proyecto, codigo),
    CONSTRAINT fk_coordinador_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo)
);

COMMENT ON TABLE t_coordinador IS 'Coordinadores de ventas. Dependen de un supervisor.';


-- =============================================================================
-- 17. VENDEDOR
-- =============================================================================

CREATE TABLE t_vendedor (
    empresa               INTEGER       NOT NULL DEFAULT 0,
    proyecto              INTEGER       NOT NULL DEFAULT 0,
    codigo                INTEGER       NOT NULL DEFAULT 0,
    nombre                VARCHAR(40)   NOT NULL,
    comision_contado      NUMERIC(18,8) NOT NULL DEFAULT 0,
    comision_semicontado  NUMERIC(18,8) NOT NULL DEFAULT 0,
    comision_completo     NUMERIC(18,8) NOT NULL DEFAULT 0,
    comision_fraccionado1 NUMERIC(18,8) NOT NULL DEFAULT 0,
    comision_fraccionado2 NUMERIC(18,8) NOT NULL DEFAULT 0,
    comision_especial     NUMERIC(18,8) NOT NULL DEFAULT 0,
    plazo                 INTEGER       NOT NULL DEFAULT 0,
    isr                   NUMERIC(18,8) NOT NULL DEFAULT 0,
    coordinador           INTEGER       NOT NULL DEFAULT 0,
    -- userid vincula al vendedor con su cuenta de usuario del sistema
    userid                UUID          REFERENCES auth.users (id),
    usuario_agrego        UUID          NOT NULL REFERENCES auth.users (id),
    fecha_agrego          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    usuario_modifico      UUID          NOT NULL REFERENCES auth.users (id),
    fecha_modifico        TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_vendedor PRIMARY KEY (empresa, proyecto, codigo),
    CONSTRAINT fk_vendedor_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo)
);

COMMENT ON TABLE t_vendedor IS 'Vendedores por proyecto con sus respectivos porcentajes de comisión.';


-- =============================================================================
-- 18. COBRADOR
-- =============================================================================

CREATE TABLE t_cobrador (
    empresa          INTEGER       NOT NULL DEFAULT 0,
    proyecto         INTEGER       NOT NULL DEFAULT 0,
    codigo           INTEGER       NOT NULL DEFAULT 0,
    nombre           VARCHAR(40)   NOT NULL,
    comision         NUMERIC(18,8) NOT NULL DEFAULT 0,
    usuario_agrego   UUID          NOT NULL REFERENCES auth.users (id),
    fecha_agrego     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    usuario_modifico UUID          NOT NULL REFERENCES auth.users (id),
    fecha_modifico   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_cobrador PRIMARY KEY (empresa, proyecto, codigo),
    CONSTRAINT fk_cobrador_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo)
);

COMMENT ON TABLE t_cobrador IS 'Cobradores asignados a proyectos.';


-- =============================================================================
-- 19. CUENTA BANCARIA
-- =============================================================================

CREATE TABLE t_cuenta_bancaria (
    empresa            INTEGER       NOT NULL DEFAULT 0,
    codigo             INTEGER       NOT NULL DEFAULT 0,
    numero             VARCHAR(15)   NOT NULL,
    banco              INTEGER       NOT NULL DEFAULT 0,
    moneda             INTEGER       NOT NULL DEFAULT 0,
    idioma             INTEGER       NOT NULL DEFAULT 0,
    cuenta_contable    VARCHAR(7)    NOT NULL,
    cheque             INTEGER       NOT NULL DEFAULT 0,
    formato_voucher    INTEGER       NOT NULL DEFAULT 0,
    protectorado       SMALLINT      NOT NULL DEFAULT 0,
    no_negociable      SMALLINT      NOT NULL DEFAULT 0,
    saldo_inicial      NUMERIC(18,2) NOT NULL DEFAULT 0,
    saldo_conciliado   NUMERIC(18,2) NOT NULL DEFAULT 0,
    fecha_conciliacion DATE,
    activa             SMALLINT      NOT NULL DEFAULT 0,
    usuario_agrego     UUID          NOT NULL REFERENCES auth.users (id),
    fecha_agrego       TIMESTAMPTZ   NOT NULL DEFAULT now(),
    usuario_modifico   UUID          NOT NULL REFERENCES auth.users (id),
    fecha_modifico     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_cuenta_bancaria PRIMARY KEY (empresa, codigo),
    CONSTRAINT fk_cta_bancaria_empresa FOREIGN KEY (empresa)
        REFERENCES t_empresa (codigo),
    CONSTRAINT fk_cta_bancaria_banco FOREIGN KEY (banco)
        REFERENCES t_banco (codigo),
    CONSTRAINT fk_cta_bancaria_moneda FOREIGN KEY (moneda)
        REFERENCES t_moneda (codigo)
);

COMMENT ON TABLE t_cuenta_bancaria IS 'Cuentas bancarias de cada empresa.';


-- =============================================================================
-- 20. CUENTA CONTABLE
-- =============================================================================

CREATE TABLE t_cuenta_contable (
    empresa       INTEGER       NOT NULL DEFAULT 0,
    nivel1        VARCHAR(1)    NOT NULL,
    nivel2        VARCHAR(1)    NOT NULL,
    nivel3        VARCHAR(1)    NOT NULL,
    nivel4        VARCHAR(2)    NOT NULL,
    nivel5        VARCHAR(2)    NOT NULL,
    nombre        VARCHAR(40)   NOT NULL,
    tipo_saldo    SMALLINT      NOT NULL DEFAULT 0,
    saldo_inicial NUMERIC(18,2) NOT NULL DEFAULT 0,
    CONSTRAINT pk_cuenta_contable PRIMARY KEY (empresa, nivel1, nivel2, nivel3, nivel4, nivel5),
    CONSTRAINT fk_cta_contable_empresa FOREIGN KEY (empresa)
        REFERENCES t_empresa (codigo)
);

COMMENT ON TABLE t_cuenta_contable IS 'Plan de cuentas contable por empresa.';


-- =============================================================================
-- 21. CONFIGURACIÓN DE FACTURA ELECTRÓNICA (GFACE - SAT Guatemala)
-- =============================================================================

CREATE TABLE t_gface (
    empresa                INTEGER      NOT NULL DEFAULT 0,
    proyecto               INTEGER      NOT NULL DEFAULT 0,
    codigo                 INTEGER      NOT NULL DEFAULT 0,
    nombre                 VARCHAR(100) NOT NULL,
    requestor              VARCHAR(50),
    entity                 VARCHAR(25),
    user_name              VARCHAR(25),
    -- NOTA: token almacenado cifrado en la aplicación; no guardar en texto plano en producción
    token                  VARCHAR(50),
    web_service            VARCHAR(100),
    web_service_documento  VARCHAR(100),
    primera_firma          SMALLINT     NOT NULL DEFAULT 0,
    certificado_post       VARCHAR(100),
    certificado_ruta       VARCHAR(100),
    certificado_nombre     VARCHAR(50),
    -- NOTA: contraseña del certificado; cifrar a nivel de aplicación
    certificado_contrasena VARCHAR(25),
    correo_envio           VARCHAR(50),
    correo_copia           VARCHAR(50),
    validar_identificacion SMALLINT     NOT NULL DEFAULT 0,
    usuario_agrego         UUID         NOT NULL REFERENCES auth.users (id),
    fecha_agrego           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    usuario_modifico       UUID         NOT NULL REFERENCES auth.users (id),
    fecha_modifico         TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT pk_gface PRIMARY KEY (empresa, proyecto, codigo),
    CONSTRAINT fk_gface_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo)
);

COMMENT ON TABLE t_gface IS 'Configuración del servicio de Factura Electrónica (GFACE - SAT Guatemala) por proyecto.';


-- =============================================================================
-- 22. SERIE DE FACTURA
-- =============================================================================

CREATE TABLE t_serie_factura (
    empresa         INTEGER     NOT NULL DEFAULT 0,
    proyecto        INTEGER     NOT NULL DEFAULT 0,
    serie           VARCHAR(3)  NOT NULL,
    gface           INTEGER     NOT NULL DEFAULT 0,
    id_docto_gface  VARCHAR(10),
    establecimiento INTEGER     NOT NULL DEFAULT 0,
    dispositivo     INTEGER     NOT NULL DEFAULT 0,
    carpeta_dtes    VARCHAR(100),
    numero          INTEGER     NOT NULL DEFAULT 0,
    formato         INTEGER     NOT NULL DEFAULT 0,
    predeterminado  SMALLINT    NOT NULL DEFAULT 0,
    activo          SMALLINT    NOT NULL DEFAULT 0,
    usuario_agrego  UUID        NOT NULL REFERENCES auth.users (id),
    fecha_agrego    TIMESTAMPTZ NOT NULL DEFAULT now(),
    usuario_modifico UUID       NOT NULL REFERENCES auth.users (id),
    fecha_modifico  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_serie_factura PRIMARY KEY (empresa, proyecto, serie),
    CONSTRAINT fk_serie_fac_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo),
    CONSTRAINT fk_serie_fac_gface FOREIGN KEY (empresa, proyecto, gface)
        REFERENCES t_gface (empresa, proyecto, codigo)
);

COMMENT ON TABLE t_serie_factura IS 'Series habilitadas para emisión de facturas por proyecto.';


-- =============================================================================
-- 23. SERIE DE RECIBO DE CAJA
-- =============================================================================

CREATE TABLE t_serie_recibo (
    empresa           INTEGER     NOT NULL DEFAULT 0,
    proyecto          INTEGER     NOT NULL DEFAULT 0,
    serie             VARCHAR(3)  NOT NULL,
    serie_factura     VARCHAR(3),
    numero            INTEGER     NOT NULL DEFAULT 0,
    formato           INTEGER     NOT NULL DEFAULT 0,
    numero_items      INTEGER     NOT NULL DEFAULT 0,
    recibo_automatico SMALLINT    NOT NULL DEFAULT 0,
    dias_fecha        INTEGER     NOT NULL DEFAULT 0,
    predeterminado    SMALLINT    NOT NULL DEFAULT 0,
    activo            SMALLINT    NOT NULL DEFAULT 0,
    usuario_agrego    UUID        NOT NULL REFERENCES auth.users (id),
    fecha_agrego      TIMESTAMPTZ NOT NULL DEFAULT now(),
    usuario_modifico  UUID        NOT NULL REFERENCES auth.users (id),
    fecha_modifico    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_serie_recibo PRIMARY KEY (empresa, proyecto, serie),
    CONSTRAINT fk_serie_recibo_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo)
);

COMMENT ON TABLE t_serie_recibo IS 'Series habilitadas para emisión de recibos de caja por proyecto.';


-- =============================================================================
-- 24. SERVICIO (ítems facturables)
-- =============================================================================

CREATE TABLE t_servicio (
    empresa          INTEGER     NOT NULL DEFAULT 0,
    proyecto         INTEGER     NOT NULL DEFAULT 0,
    codigo           VARCHAR(15) NOT NULL,
    descripcion      VARCHAR(50) NOT NULL,
    unidad_medida    VARCHAR(5)  NOT NULL,
    tipo_item        SMALLINT    NOT NULL DEFAULT 0,
    activo           SMALLINT    NOT NULL DEFAULT 0,
    usuario_agrego   UUID        NOT NULL REFERENCES auth.users (id),
    fecha_agrego     TIMESTAMPTZ NOT NULL DEFAULT now(),
    usuario_modifico UUID        NOT NULL REFERENCES auth.users (id),
    fecha_modifico   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_servicio PRIMARY KEY (empresa, proyecto, codigo),
    CONSTRAINT fk_servicio_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo)
);

COMMENT ON TABLE t_servicio IS 'Catálogo de servicios o ítems utilizados en la facturación.';


-- =============================================================================
-- 25. TIPO DE OTROS INGRESOS
-- =============================================================================

CREATE TABLE t_tipo_otros_ingresos (
    empresa          INTEGER       NOT NULL DEFAULT 0,
    proyecto         INTEGER       NOT NULL DEFAULT 0,
    codigo           INTEGER       NOT NULL DEFAULT 0,
    descripcion      VARCHAR(40)   NOT NULL,
    etiqueta         VARCHAR(10),
    forma_pago       SMALLINT      NOT NULL DEFAULT 0,
    monto            NUMERIC(18,8) NOT NULL DEFAULT 0,
    hasta_monto      NUMERIC(18,2) NOT NULL DEFAULT 0,
    mora             SMALLINT      NOT NULL DEFAULT 0,
    impuesto         SMALLINT      NOT NULL DEFAULT 0,
    editable         SMALLINT      NOT NULL DEFAULT 0,
    activo           SMALLINT      NOT NULL DEFAULT 0,
    usuario_agrego   UUID          NOT NULL REFERENCES auth.users (id),
    fecha_agrego     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    usuario_modifico UUID          NOT NULL REFERENCES auth.users (id),
    fecha_modifico   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_tipo_otros_ingresos PRIMARY KEY (empresa, proyecto, codigo),
    CONSTRAINT fk_toi_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo)
);

COMMENT ON TABLE t_tipo_otros_ingresos IS 'Tipos de cargos adicionales que se pueden aplicar en una promesa (mantenimiento, señalización, etc.).';


-- =============================================================================
-- 26. PARÁMETROS DE EMPRESA
-- =============================================================================

CREATE TABLE t_parametros_empresa (
    empresa         INTEGER       NOT NULL DEFAULT 0,
    horario         VARCHAR(40),
    dia_pago        INTEGER       NOT NULL DEFAULT 0,
    iva             NUMERIC(18,8) NOT NULL DEFAULT 0,
    cuenta_bancaria INTEGER       NOT NULL DEFAULT 0,
    tipo_cliente    SMALLINT      NOT NULL DEFAULT 0,
    grupo_cliente   SMALLINT      NOT NULL DEFAULT 0,
    cliente         INTEGER       NOT NULL DEFAULT 0,
    tarjeta         SMALLINT      NOT NULL DEFAULT 0,
    departamento    SMALLINT      NOT NULL DEFAULT 0,
    vendedor        INTEGER       NOT NULL DEFAULT 0,
    cobrador        INTEGER       NOT NULL DEFAULT 0,
    grupo           INTEGER       NOT NULL DEFAULT 0,
    proyectos       INTEGER       NOT NULL DEFAULT 0,
    CONSTRAINT pk_parametros_empresa PRIMARY KEY (empresa),
    CONSTRAINT fk_params_empresa FOREIGN KEY (empresa)
        REFERENCES t_empresa (codigo)
);

COMMENT ON TABLE t_parametros_empresa IS 'Parámetros de configuración general a nivel de empresa.';


-- =============================================================================
-- 27. PROMESA DE COMPRA-VENTA
-- =============================================================================

CREATE TABLE t_promesa (
    empresa              INTEGER       NOT NULL DEFAULT 0,
    proyecto             INTEGER       NOT NULL DEFAULT 0,
    numero               INTEGER       NOT NULL DEFAULT 0,
    fecha                DATE          NOT NULL,
    cliente              INTEGER       NOT NULL DEFAULT 0,
    vendedor             INTEGER       NOT NULL DEFAULT 0,
    fase                 INTEGER       NOT NULL DEFAULT 0,
    manzana              VARCHAR(5)    NOT NULL,
    lote                 VARCHAR(5)    NOT NULL,
    valor_lote           NUMERIC(18,2) NOT NULL DEFAULT 0,
    subsidio             NUMERIC(18,2) NOT NULL DEFAULT 0,
    arras                NUMERIC(18,2) NOT NULL DEFAULT 0,
    monto_enganche       NUMERIC(18,2) NOT NULL DEFAULT 0,
    primer_enganche      NUMERIC(18,2) NOT NULL DEFAULT 0,
    plazo_enganche       INTEGER       NOT NULL DEFAULT 0,
    interes_anual        NUMERIC(18,8) NOT NULL DEFAULT 0,
    forma_mora           SMALLINT      NOT NULL DEFAULT 0,
    interes_mora         NUMERIC(18,8) NOT NULL DEFAULT 0,
    fijo_mora            SMALLINT      NOT NULL DEFAULT 0,
    mora_enganche        SMALLINT      NOT NULL DEFAULT 0,
    dias_gracia          INTEGER       NOT NULL DEFAULT 0,
    dias_afectos         INTEGER       NOT NULL DEFAULT 0,
    forma_financiamiento SMALLINT      NOT NULL DEFAULT 0,
    fecha_financiamiento DATE,
    monto_financiamiento NUMERIC(18,2) NOT NULL DEFAULT 0,
    plazo_financiamiento INTEGER       NOT NULL DEFAULT 0,
    fecha_cancelacion    DATE,
    venta                SMALLINT      NOT NULL DEFAULT 0,
    observacion          VARCHAR(150),
    estado               SMALLINT      NOT NULL DEFAULT 0,
    usuario_agrego       UUID          NOT NULL REFERENCES auth.users (id),
    fecha_agrego         TIMESTAMPTZ   NOT NULL DEFAULT now(),
    usuario_modifico     UUID          NOT NULL REFERENCES auth.users (id),
    fecha_modifico       TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_promesa PRIMARY KEY (empresa, proyecto, numero),
    CONSTRAINT fk_promesa_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo),
    CONSTRAINT fk_promesa_cliente FOREIGN KEY (empresa, proyecto, cliente)
        REFERENCES t_cliente (empresa, proyecto, codigo),
    CONSTRAINT fk_promesa_lote FOREIGN KEY (empresa, proyecto, fase, manzana, lote)
        REFERENCES t_lote (empresa, proyecto, fase, manzana, numero)
);

COMMENT ON TABLE t_promesa IS 'Promesas de compra-venta de lotes. Contiene todas las condiciones financieras del contrato.';
COMMENT ON COLUMN t_promesa.estado IS '0=activa, 1=cancelada, 2=rescindida.';
COMMENT ON COLUMN t_promesa.forma_financiamiento IS '0=contado, 1=enganche+cuotas, 2=especial.';


-- =============================================================================
-- 28. OTROS CARGOS DE PROMESA (cuotas especiales tipo HOA, señalización, etc.)
-- =============================================================================

CREATE TABLE t_promesa_otros (
    empresa       INTEGER       NOT NULL DEFAULT 0,
    proyecto      INTEGER       NOT NULL DEFAULT 0,
    promesa       INTEGER       NOT NULL DEFAULT 0,
    secuencia     INTEGER       NOT NULL DEFAULT 0,
    tipo_otros    INTEGER       NOT NULL DEFAULT 0,
    monto         NUMERIC(18,8) NOT NULL DEFAULT 0,
    hasta_monto   NUMERIC(18,2) NOT NULL DEFAULT 0,
    mora          SMALLINT      NOT NULL DEFAULT 0,
    apartir_de    DATE,
    aplicar_hasta DATE,
    CONSTRAINT pk_promesa_otros PRIMARY KEY (empresa, proyecto, promesa, secuencia),
    CONSTRAINT fk_promesa_otros FOREIGN KEY (empresa, proyecto, promesa)
        REFERENCES t_promesa (empresa, proyecto, numero),
    CONSTRAINT fk_promesa_otros_tipo FOREIGN KEY (empresa, proyecto, tipo_otros)
        REFERENCES t_tipo_otros_ingresos (empresa, proyecto, codigo)
);

COMMENT ON TABLE t_promesa_otros IS 'Cargos adicionales vinculados a una promesa (mantenimiento, otros servicios).';


-- =============================================================================
-- 29. PARÁMETROS DE PROMESA (historial de versiones de condiciones financieras)
-- =============================================================================

CREATE TABLE t_parametros_promesa (
    empresa                    INTEGER       NOT NULL DEFAULT 0,
    proyecto                   INTEGER       NOT NULL DEFAULT 0,
    promesa                    INTEGER       NOT NULL DEFAULT 0,
    apartir_de                 DATE          NOT NULL,
    forma_financiamiento       SMALLINT      NOT NULL DEFAULT 0,
    monto_financiamiento       NUMERIC(18,2) NOT NULL DEFAULT 0,
    plazo_financiamiento       INTEGER       NOT NULL DEFAULT 0,
    interes_anual              NUMERIC(18,8) NOT NULL DEFAULT 0,
    forma_mora                 SMALLINT      NOT NULL DEFAULT 0,
    interes_mora               NUMERIC(18,8) NOT NULL DEFAULT 0,
    fijo_mora                  NUMERIC(18,8) NOT NULL DEFAULT 0,
    dias_afectos               INTEGER       NOT NULL DEFAULT 0,
    dias_gracia                INTEGER       NOT NULL DEFAULT 0,
    inicial                    SMALLINT      NOT NULL DEFAULT 0,
    condiciones_financiamiento SMALLINT      NOT NULL DEFAULT 0,
    condiciones_mora           SMALLINT      NOT NULL DEFAULT 0,
    version                    INTEGER       NOT NULL DEFAULT 0,
    estado                     SMALLINT      NOT NULL DEFAULT 0,
    usuario_agrego             UUID          NOT NULL REFERENCES auth.users (id),
    fecha_agrego               TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_parametros_promesa PRIMARY KEY (empresa, proyecto, promesa, version),
    CONSTRAINT fk_params_promesa FOREIGN KEY (empresa, proyecto, promesa)
        REFERENCES t_promesa (empresa, proyecto, numero)
);

COMMENT ON TABLE t_parametros_promesa IS 'Historial de cambios en las condiciones financieras de una promesa (reestructuraciones).';


-- =============================================================================
-- 30. PLAN DE PAGO (cuadro de amortización)
-- =============================================================================

CREATE TABLE t_plan_pago (
    empresa        INTEGER       NOT NULL DEFAULT 0,
    proyecto       INTEGER       NOT NULL DEFAULT 0,
    promesa        INTEGER       NOT NULL DEFAULT 0,
    fecha          DATE          NOT NULL,
    tipo_cuota     SMALLINT      NOT NULL DEFAULT 0,
    cuota          INTEGER       NOT NULL DEFAULT 0,
    capital        NUMERIC(18,2) NOT NULL DEFAULT 0,
    capital_pagado NUMERIC(18,2) NOT NULL DEFAULT 0,
    interes        NUMERIC(18,2) NOT NULL DEFAULT 0,
    interes_pagado NUMERIC(18,2) NOT NULL DEFAULT 0,
    mora           NUMERIC(18,2) NOT NULL DEFAULT 0,
    mora_pagado    NUMERIC(18,2) NOT NULL DEFAULT 0,
    otros          NUMERIC(18,2) NOT NULL DEFAULT 0,
    estado         SMALLINT      NOT NULL DEFAULT 0,
    CONSTRAINT pk_plan_pago PRIMARY KEY (empresa, proyecto, promesa, tipo_cuota, cuota),
    CONSTRAINT fk_plan_pago_promesa FOREIGN KEY (empresa, proyecto, promesa)
        REFERENCES t_promesa (empresa, proyecto, numero)
);

COMMENT ON TABLE t_plan_pago IS 'Plan de pagos (amortización) de cada promesa. Se actualiza con cada pago recibido.';
COMMENT ON COLUMN t_plan_pago.estado IS '0=pendiente, 1=pagada, 2=pagada parcialmente, 3=vencida.';


-- =============================================================================
-- 31. PLAN DE OTROS INGRESOS (cuotas de cargos adicionales)
-- =============================================================================

CREATE TABLE t_plan_otros (
    empresa      INTEGER       NOT NULL DEFAULT 0,
    proyecto     INTEGER       NOT NULL DEFAULT 0,
    promesa      INTEGER       NOT NULL DEFAULT 0,
    fecha        DATE          NOT NULL,
    tipo_cuota   SMALLINT      NOT NULL DEFAULT 0,
    cuota        INTEGER       NOT NULL DEFAULT 0,
    secuencia    INTEGER       NOT NULL DEFAULT 0,
    monto        NUMERIC(18,2) NOT NULL DEFAULT 0,
    monto_pagado NUMERIC(18,2) NOT NULL DEFAULT 0,
    CONSTRAINT pk_plan_otros PRIMARY KEY (empresa, proyecto, promesa, tipo_cuota, cuota, secuencia),
    CONSTRAINT fk_plan_otros_promesa FOREIGN KEY (empresa, proyecto, promesa)
        REFERENCES t_promesa (empresa, proyecto, numero)
);

COMMENT ON TABLE t_plan_otros IS 'Plan de pagos para los cargos adicionales de una promesa.';


-- =============================================================================
-- 32. RECIBO DE CAJA (comprobante de pago)
-- =============================================================================

CREATE TABLE t_recibo_caja (
    empresa              INTEGER       NOT NULL DEFAULT 0,
    proyecto             INTEGER       NOT NULL DEFAULT 0,
    serie                VARCHAR(3)    NOT NULL,
    numero               INTEGER       NOT NULL DEFAULT 0,
    promesa              INTEGER       NOT NULL DEFAULT 0,
    fase                 INTEGER       NOT NULL DEFAULT 0,
    manzana              VARCHAR(5),
    lote                 VARCHAR(5),
    forma_pago           SMALLINT      NOT NULL DEFAULT 0,
    fecha_emision        DATE          NOT NULL,
    fecha_pago           DATE          NOT NULL,
    cliente              INTEGER       NOT NULL DEFAULT 0,
    nombre               VARCHAR(100),
    direccion            VARCHAR(150),
    telefono             VARCHAR(15),
    nit                  VARCHAR(20),
    banco                INTEGER       NOT NULL DEFAULT 0,
    cheque               VARCHAR(15),
    numero_cuenta        VARCHAR(20),
    autorizacion         VARCHAR(15),
    cuenta_deposito      INTEGER       NOT NULL DEFAULT 0,
    transaccion_bancaria VARCHAR(11),
    cobrador             INTEGER       NOT NULL DEFAULT 0,
    moneda               INTEGER       NOT NULL DEFAULT 0,
    monto                NUMERIC(18,2) NOT NULL DEFAULT 0,
    mora                 NUMERIC(18,2) NOT NULL DEFAULT 0,
    tasa_cambio          NUMERIC(18,8) NOT NULL DEFAULT 0,
    abono_capital        SMALLINT      NOT NULL DEFAULT 0,
    es_otros             SMALLINT      NOT NULL DEFAULT 0,
    tipo_otro_ingreso    INTEGER       NOT NULL DEFAULT 0,
    factura_serie        VARCHAR(3),
    factura_numero       INTEGER       NOT NULL DEFAULT 0,
    observacion          VARCHAR(150),
    fecha_comision       DATE,
    secuencia            INTEGER       NOT NULL DEFAULT 0,
    estado               SMALLINT      NOT NULL DEFAULT 0,
    usuario_agrego       UUID          NOT NULL REFERENCES auth.users (id),
    fecha_agrego         TIMESTAMPTZ   NOT NULL DEFAULT now(),
    usuario_modifico     UUID          NOT NULL REFERENCES auth.users (id),
    fecha_modifico       TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_recibo_caja PRIMARY KEY (empresa, proyecto, serie, numero),
    CONSTRAINT fk_recibo_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo),
    CONSTRAINT fk_recibo_promesa FOREIGN KEY (empresa, proyecto, promesa)
        REFERENCES t_promesa (empresa, proyecto, numero),
    CONSTRAINT fk_recibo_banco FOREIGN KEY (banco)
        REFERENCES t_banco (codigo),
    CONSTRAINT fk_recibo_moneda FOREIGN KEY (moneda)
        REFERENCES t_moneda (codigo)
);

COMMENT ON TABLE t_recibo_caja IS 'Recibos de caja emitidos por pagos de clientes.';
COMMENT ON COLUMN t_recibo_caja.estado IS '0=activo, 1=anulado.';


-- =============================================================================
-- 33. DETALLE DE RECIBO DE CAJA (distribución del pago en cuotas)
-- =============================================================================

CREATE TABLE t_detalle_recibo_caja (
    empresa      INTEGER       NOT NULL DEFAULT 0,
    proyecto     INTEGER       NOT NULL DEFAULT 0,
    serie_recibo VARCHAR(3)    NOT NULL,
    recibo       INTEGER       NOT NULL DEFAULT 0,
    fecha_cuota  DATE          NOT NULL,
    tipo_cuota   SMALLINT      NOT NULL DEFAULT 0,
    cuota        INTEGER       NOT NULL DEFAULT 0,
    capital      NUMERIC(18,2) NOT NULL DEFAULT 0,
    intereses    NUMERIC(18,2) NOT NULL DEFAULT 0,
    mora         NUMERIC(18,2) NOT NULL DEFAULT 0,
    otros        NUMERIC(18,2) NOT NULL DEFAULT 0,
    CONSTRAINT pk_detalle_recibo_caja PRIMARY KEY (empresa, proyecto, serie_recibo, recibo, tipo_cuota, cuota),
    CONSTRAINT fk_det_recibo_caja FOREIGN KEY (empresa, proyecto, serie_recibo, recibo)
        REFERENCES t_recibo_caja (empresa, proyecto, serie, numero)
);

COMMENT ON TABLE t_detalle_recibo_caja IS 'Detalle de la aplicación del pago a cada cuota del plan de pagos.';


-- =============================================================================
-- 34. DETALLE DE RECIBO - OTROS INGRESOS
-- =============================================================================

CREATE TABLE t_detalle_recibo_otros (
    empresa      INTEGER       NOT NULL DEFAULT 0,
    proyecto     INTEGER       NOT NULL DEFAULT 0,
    serie_recibo VARCHAR(3)    NOT NULL,
    recibo       INTEGER       NOT NULL DEFAULT 0,
    fecha_cuota  DATE          NOT NULL,
    tipo_cuota   SMALLINT      NOT NULL DEFAULT 0,
    cuota        INTEGER       NOT NULL DEFAULT 0,
    secuencia    INTEGER       NOT NULL DEFAULT 0,
    otro         NUMERIC(18,2) NOT NULL DEFAULT 0,
    CONSTRAINT pk_detalle_recibo_otros PRIMARY KEY (empresa, proyecto, serie_recibo, recibo, tipo_cuota, cuota, secuencia),
    CONSTRAINT fk_det_recibo_otros FOREIGN KEY (empresa, proyecto, serie_recibo, recibo)
        REFERENCES t_recibo_caja (empresa, proyecto, serie, numero)
);

COMMENT ON TABLE t_detalle_recibo_otros IS 'Detalle de la aplicación del pago a los cargos adicionales.';


-- =============================================================================
-- 35. FACTURA
-- =============================================================================

CREATE TABLE t_factura (
    empresa                 INTEGER       NOT NULL DEFAULT 0,
    proyecto                INTEGER       NOT NULL DEFAULT 0,
    serie                   VARCHAR(3)    NOT NULL,
    factura                 INTEGER       NOT NULL DEFAULT 0,
    fecha                   DATE          NOT NULL,
    cliente                 INTEGER       NOT NULL DEFAULT 0,
    nombre                  VARCHAR(100)  NOT NULL,
    direccion               VARCHAR(150),
    telefono                VARCHAR(15),
    nit                     VARCHAR(20),
    vendedor                INTEGER       NOT NULL DEFAULT 0,
    cobrador                INTEGER       NOT NULL DEFAULT 0,
    pedido                  VARCHAR(15),
    dias_credito            INTEGER       NOT NULL DEFAULT 0,
    fecha_pago              DATE,
    fecha_proximo_pago      DATE,
    fecha_cancelacion       DATE,
    fecha_periodo           DATE,
    contrasena              VARCHAR(15),
    partida                 VARCHAR(11),
    partida_anulacion       VARCHAR(11),
    partida_costo           VARCHAR(11),
    partida_costo_anulacion VARCHAR(11),
    moneda                  INTEGER       NOT NULL DEFAULT 0,
    tasa_cambio             NUMERIC(18,8) NOT NULL DEFAULT 0,
    iva                     NUMERIC(18,8) NOT NULL DEFAULT 0,
    total_pagado            NUMERIC(18,2) NOT NULL DEFAULT 0,
    exportacion             SMALLINT      NOT NULL DEFAULT 0,
    periodo                 VARCHAR(50),
    observaciones           VARCHAR(254),
    origen                  SMALLINT      NOT NULL DEFAULT 0,
    certificar_gface        SMALLINT      NOT NULL DEFAULT 0,
    certificado_gface       VARCHAR(255),
    certificado_serie       VARCHAR(10),
    certificado_numero      VARCHAR(10),
    certificado_fecha       VARCHAR(50),
    id_documento            VARCHAR(50),
    anular_gface            SMALLINT      NOT NULL DEFAULT 0,
    anulada_nc              SMALLINT      NOT NULL DEFAULT 0,
    estado                  SMALLINT      NOT NULL DEFAULT 0,
    usuario_agrego          UUID          NOT NULL REFERENCES auth.users (id),
    fecha_agrego            TIMESTAMPTZ   NOT NULL DEFAULT now(),
    usuario_modifico        UUID          NOT NULL REFERENCES auth.users (id),
    fecha_modifico          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_factura PRIMARY KEY (empresa, proyecto, serie, factura),
    CONSTRAINT fk_factura_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo),
    CONSTRAINT fk_factura_cliente FOREIGN KEY (empresa, proyecto, cliente)
        REFERENCES t_cliente (empresa, proyecto, codigo),
    CONSTRAINT fk_factura_moneda FOREIGN KEY (moneda)
        REFERENCES t_moneda (codigo)
);

COMMENT ON TABLE t_factura IS 'Facturas emitidas (FEL - Factura Electrónica en Línea SAT Guatemala).';
COMMENT ON COLUMN t_factura.estado IS '0=vigente, 1=anulada, 2=vencida.';
COMMENT ON COLUMN t_factura.id_documento IS 'UUID del DTE certificado por el SAT a través de GFACE.';


-- =============================================================================
-- 36. DETALLE DE FACTURA
-- =============================================================================

CREATE TABLE t_detalle_factura (
    empresa      INTEGER       NOT NULL DEFAULT 0,
    proyecto     INTEGER       NOT NULL DEFAULT 0,
    serie        VARCHAR(3)    NOT NULL,
    factura      INTEGER       NOT NULL DEFAULT 0,
    secuencia    INTEGER       NOT NULL DEFAULT 0,
    servicio     VARCHAR(15)   NOT NULL,
    descripcion  VARCHAR(500)  NOT NULL,
    precio_venta NUMERIC(18,8) NOT NULL DEFAULT 0,
    cantidad     NUMERIC(18,8) NOT NULL DEFAULT 0,
    descuento    NUMERIC(18,8) NOT NULL DEFAULT 0,
    CONSTRAINT pk_detalle_factura PRIMARY KEY (empresa, proyecto, serie, factura, secuencia),
    CONSTRAINT fk_det_factura FOREIGN KEY (empresa, proyecto, serie, factura)
        REFERENCES t_factura (empresa, proyecto, serie, factura)
);

COMMENT ON TABLE t_detalle_factura IS 'Líneas de detalle de cada factura emitida.';


-- =============================================================================
-- 37. TRANSACCIÓN BANCARIA
-- =============================================================================

CREATE TABLE t_transaccion_bancaria (
    empresa                   INTEGER       NOT NULL DEFAULT 0,
    cuenta_bancaria           INTEGER       NOT NULL DEFAULT 0,
    numero_transaccion        VARCHAR(11)   NOT NULL,
    tipo_transaccion          SMALLINT      NOT NULL DEFAULT 0,
    fecha                     DATE          NOT NULL,
    numero_documento          VARCHAR(15)   NOT NULL,
    partida                   VARCHAR(11),
    valor                     NUMERIC(18,2) NOT NULL DEFAULT 0,
    valor_en_letras           VARCHAR(100),
    tipo_saldo                SMALLINT      NOT NULL DEFAULT 0,
    en_circulacion            SMALLINT      NOT NULL DEFAULT 0,
    a_nombre_de               VARCHAR(100),
    comentario                VARCHAR(255),
    fecha_conciliacion        DATE,
    origen                    SMALLINT      NOT NULL DEFAULT 0,
    tasa_cambio               NUMERIC(18,8) NOT NULL DEFAULT 0,
    cuenta_transferencia      INTEGER       NOT NULL DEFAULT 0,
    transaccion_transferencia VARCHAR(11),
    estado                    SMALLINT      NOT NULL DEFAULT 0,
    usuario_agrego            UUID          NOT NULL REFERENCES auth.users (id),
    fecha_agrego              TIMESTAMPTZ   NOT NULL DEFAULT now(),
    usuario_modifico          UUID          NOT NULL REFERENCES auth.users (id),
    fecha_modifico            TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_transaccion_bancaria PRIMARY KEY (empresa, cuenta_bancaria, numero_transaccion),
    CONSTRAINT fk_transaccion_cta FOREIGN KEY (empresa, cuenta_bancaria)
        REFERENCES t_cuenta_bancaria (empresa, codigo)
);

COMMENT ON TABLE t_transaccion_bancaria IS 'Movimientos bancarios registrados por empresa.';


-- =============================================================================
-- 38. CORRELATIVO (consecutivos de documentos)
-- =============================================================================

CREATE TABLE t_correlativo (
    empresa        INTEGER  NOT NULL DEFAULT 0,
    banco          INTEGER  NOT NULL DEFAULT 0,
    moneda         INTEGER  NOT NULL DEFAULT 0,
    tipo_proveedor SMALLINT NOT NULL DEFAULT 0,
    proveedor      INTEGER  NOT NULL DEFAULT 0,
    servicio_sat   INTEGER  NOT NULL DEFAULT 0,
    CONSTRAINT pk_correlativo PRIMARY KEY (empresa, banco, moneda)
);

COMMENT ON TABLE t_correlativo IS 'Correlativos de documentos para integración bancaria y SAT.';


-- =============================================================================
-- 39. TABLA DE COMISIONES (escalas de porcentaje por volumen de ventas)
-- =============================================================================

CREATE TABLE t_tabla_comision (
    empresa    INTEGER       NOT NULL DEFAULT 0,
    proyecto   INTEGER       NOT NULL DEFAULT 0,
    tipo       SMALLINT      NOT NULL DEFAULT 0,
    vendedor   INTEGER       NOT NULL DEFAULT 0,
    ventas     INTEGER       NOT NULL DEFAULT 0,
    porcentaje NUMERIC(18,8) NOT NULL DEFAULT 0,
    CONSTRAINT pk_tabla_comision PRIMARY KEY (empresa, proyecto, tipo, vendedor, ventas),
    CONSTRAINT fk_tabla_comision_proyecto FOREIGN KEY (empresa, proyecto)
        REFERENCES t_proyecto (empresa, codigo)
);

COMMENT ON TABLE t_tabla_comision IS 'Escalas de comisiones por vendedor según volumen de ventas.';


-- =============================================================================
-- 40. MENÚ POR USUARIO (permisos granulares por pantalla)
-- =============================================================================

CREATE TABLE t_menu_usuario (
    userid    UUID       NOT NULL REFERENCES auth.users (id),
    indice    VARCHAR(8) NOT NULL,
    agregar   SMALLINT   NOT NULL DEFAULT 0,
    modificar SMALLINT   NOT NULL DEFAULT 0,
    eliminar  SMALLINT   NOT NULL DEFAULT 0,
    consultar SMALLINT   NOT NULL DEFAULT 0,
    CONSTRAINT pk_menu_usuario PRIMARY KEY (userid, indice),
    CONSTRAINT fk_menu_usuario_menu FOREIGN KEY (indice)
        REFERENCES t_menu (indice)
);

COMMENT ON TABLE t_menu_usuario IS 'Permisos de acceso por usuario a cada módulo del sistema.';


-- =============================================================================
-- 41. ACCESO DIRECTO (atajos / favoritos por usuario)
-- =============================================================================

CREATE TABLE t_acceso_directo (
    userid          UUID        NOT NULL REFERENCES auth.users (id),
    secuencia       INTEGER     NOT NULL DEFAULT 0,
    nombre          VARCHAR(20) NOT NULL,
    tipo_aplicacion SMALLINT    NOT NULL DEFAULT 0,
    indice          VARCHAR(8),
    path            VARCHAR(100),
    aplicacion      VARCHAR(40),
    documento       VARCHAR(100),
    CONSTRAINT pk_acceso_directo PRIMARY KEY (userid, secuencia)
);

COMMENT ON TABLE t_acceso_directo IS 'Accesos directos o favoritos configurados por cada usuario.';


-- =============================================================================
-- FIN DEL ESQUEMA
-- Tablas creadas: 41
-- Tablas nuevas respecto al modelo original (Cartera.mwb):
--   + t_grupo_economico
--   + t_grupo_usuario
-- Tablas removidas del modelo original:
--   - sysdiagrams       (específica de SQL Server)
--   - t_parametro_general (específica de aplicación de escritorio)
-- =============================================================================
