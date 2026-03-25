// Definición del menú de navegación — fuente única de verdad
//
// Estructura de un ítem de sección (expandible):
//   { id, label, icon, type: 'section', groups: [ { id, label, items: [...] } ] }
//
// Estructura de un ítem simple:
//   { id, label, icon, type: 'item', path }
//
// Para agregar nuevas secciones de menú o ítems de catálogo,
// este es el único archivo que hay que editar.

export const NAV_ITEMS = [
  {
    type: 'item',
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/',
  },

  {
    type: 'section',
    id: 'catalogos',
    label: 'Catálogos',
    icon: 'catalogos',
    groups: [

      // ─── 1. ORGANIZACIÓN ───────────────────────────────────────────────
      // El "quién somos": estructura legal y accesos al sistema
      {
        id: 'organizacion',
        label: 'Organización',
        description: 'Estructura legal, empresas y accesos al sistema',
        accent: 'sky',
        icon: 'organizacion',
        items: [
          {
            id: 'grupos-economicos',
            label: 'Grupos Económicos',
            path: '/catalogos/grupos-economicos',
          },
          {
            id: 'empresas',
            label: 'Empresas',
            path: '/catalogos/empresas',
          },
          {
            id: 'usuarios',
            label: 'Usuarios',
            path: '/catalogos/usuarios',
          },
        ],
      },

      // ─── 2. PROYECTOS ──────────────────────────────────────────────────
      // La jerarquía física del negocio: Proyecto → Fase → Manzana → Lote
      {
        id: 'proyectos',
        label: 'Proyectos',
        description: 'Proyectos, fases, manzanas y lotes disponibles',
        accent: 'emerald',
        icon: 'proyectos',
        items: [
          {
            id: 'proyectos',
            label: 'Proyectos',
            path: '/catalogos/proyectos',
          },
          {
            id: 'fases',
            label: 'Fases',
            path: '/catalogos/fases',
          },
          {
            id: 'manzanas',
            label: 'Manzanas',
            path: '/catalogos/manzanas',
          },
          {
            id: 'lotes',
            label: 'Lotes',
            path: '/catalogos/lotes',
          },
        ],
      },

      // ─── 3. PERSONAL ──────────────────────────────────────────────────
      // Equipo de ventas y cobranza
      {
        id: 'personal',
        label: 'Personal',
        description: 'Supervisores, coordinadores, vendedores y cobradores',
        accent: 'violet',
        icon: 'personal',
        items: [
          {
            id: 'supervisores',
            label: 'Supervisores',
            path: '/catalogos/supervisores',
          },
          {
            id: 'coordinadores',
            label: 'Coordinadores',
            path: '/catalogos/coordinadores',
          },
          {
            id: 'vendedores',
            label: 'Vendedores',
            path: '/catalogos/vendedores',
          },
          {
            id: 'cobradores',
            label: 'Cobradores',
            path: '/catalogos/cobradores',
          },
        ],
      },

      // ─── 4. CLIENTES ──────────────────────────────────────────────────
      // Compradores de lotes
      {
        id: 'clientes',
        label: 'Clientes',
        description: 'Registro y seguimiento de compradores de lotes',
        accent: 'amber',
        icon: 'clientes',
        items: [
          {
            id: 'clientes',
            label: 'Clientes',
            path: '/catalogos/clientes',
          },
        ],
      },

      // ─── 5. FINANZAS ──────────────────────────────────────────────────
      // Configuración financiera del sistema
      {
        id: 'finanzas',
        label: 'Finanzas',
        description: 'Bancos, cuentas bancarias y configuración de monedas',
        accent: 'teal',
        icon: 'finanzas',
        items: [
          {
            id: 'bancos',
            label: 'Bancos',
            path: '/catalogos/bancos',
          },
          {
            id: 'cuentas-bancarias',
            label: 'Cuentas Bancarias',
            path: '/catalogos/cuentas-bancarias',
          },
          {
            id: 'monedas',
            label: 'Monedas',
            path: '/catalogos/monedas',
          },
        ],
      },

      // ─── 6. REFERENCIA GEOGRÁFICA ─────────────────────────────────────
      // Datos geográficos de Guatemala
      {
        id: 'referencia',
        label: 'Referencia Geográfica',
        description: 'Departamentos y municipios de Guatemala',
        accent: 'rose',
        icon: 'referencia',
        items: [
          {
            id: 'departamentos',
            label: 'Departamentos',
            path: '/catalogos/departamentos',
          },
          {
            id: 'municipios',
            label: 'Municipios',
            path: '/catalogos/municipios',
          },
        ],
      },

    ],
  },

  // ── Próximas secciones de menú (agregar aquí cuando se desarrollen) ──────
  // { type: 'section', id: 'contratos', label: 'Contratos', icon: 'contratos', ... }
  // { type: 'section', id: 'pagos',     label: 'Pagos',     icon: 'pagos',     ... }
  // { type: 'section', id: 'reportes',  label: 'Reportes',  icon: 'reportes',  ... }
]
