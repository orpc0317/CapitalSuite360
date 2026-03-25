// Rutas de la aplicación con protección de acceso y layout compartido
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Layout
import AppLayout from '../components/layout/AppLayout'

// Páginas de autenticación
import Login from '../pages/auth/Login'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'

// Páginas principales
import Dashboard from '../pages/dashboard/Dashboard'
import GroupHub from '../pages/catalogos/GroupHub'
import PlaceholderCatalogo from '../pages/catalogos/PlaceholderCatalogo'

// Spinner compartido entre guards
function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <svg
        className="animate-spin text-blue-600"
        width="32" height="32" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        aria-label="Cargando"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  )
}

// Guard de rutas protegidas — renderiza AppLayout (con Outlet) cuando hay sesión
function LayoutProtegido() {
  const { usuario, cargando } = useAuth()
  if (cargando) return <Spinner />
  if (!usuario) return <Navigate to="/login" replace />
  return <AppLayout />
}

// Guard de rutas públicas — redirige al dashboard si ya hay sesión activa
function RutaPublica({ children }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return <Spinner />
  return !usuario ? children : <Navigate to="/" replace />
}

// Helper: crea el elemento placeholder para los catálogos en construcción
function cat(titulo, descripcion) {
  return <PlaceholderCatalogo titulo={titulo} descripcion={descripcion} />
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Rutas públicas ─────────────────────────────────────────── */}
        <Route path="/login" element={<RutaPublica><Login /></RutaPublica>} />
        <Route path="/forgot-password" element={<RutaPublica><ForgotPassword /></RutaPublica>} />
        {/* Reset: accesible sin sesión (viene del enlace del correo de recuperación) */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ── Rutas protegidas (comparten sidebar + header via AppLayout) ── */}
        <Route element={<LayoutProtegido />}>

          {/* Landing page */}
          <Route path="/" element={<Dashboard />} />

          {/* Hubs de grupos — pantalla intermedia del launcher */}
          <Route path="/catalogos/grupo/:groupId" element={<GroupHub />} />

          {/* Catálogos — Organización */}
          <Route path="/catalogos/grupos-economicos" element={cat('Grupos Económicos', 'Administración de grupos económicos multi-empresa.')} />
          <Route path="/catalogos/empresas"          element={cat('Empresas',          'Empresas de lotificación del sistema.')} />
          <Route path="/catalogos/usuarios"          element={cat('Usuarios',          'Usuarios del sistema y sus permisos de acceso.')} />

          {/* Catálogos — Proyectos */}
          <Route path="/catalogos/proyectos" element={cat('Proyectos', 'Proyectos de lotificación por empresa.')} />
          <Route path="/catalogos/fases"     element={cat('Fases',     'Fases o etapas dentro de un proyecto.')} />
          <Route path="/catalogos/manzanas"  element={cat('Manzanas',  'Manzanas dentro de una fase del proyecto.')} />
          <Route path="/catalogos/lotes"     element={cat('Lotes',     'Lotes individuales disponibles para venta.')} />

          {/* Catálogos — Personal */}
          <Route path="/catalogos/supervisores"  element={cat('Supervisores',  'Supervisores de ventas por proyecto.')} />
          <Route path="/catalogos/coordinadores" element={cat('Coordinadores', 'Coordinadores de ventas por proyecto.')} />
          <Route path="/catalogos/vendedores"    element={cat('Vendedores',    'Vendedores y sus comisiones por proyecto.')} />
          <Route path="/catalogos/cobradores"    element={cat('Cobradores',    'Cobradores asignados a proyectos.')} />

          {/* Catálogos — Clientes */}
          <Route path="/catalogos/clientes" element={cat('Clientes', 'Compradores de lotes por proyecto.')} />

          {/* Catálogos — Finanzas */}
          <Route path="/catalogos/bancos"           element={cat('Bancos',           'Catálogo de bancos del sistema financiero.')} />
          <Route path="/catalogos/cuentas-bancarias" element={cat('Cuentas Bancarias', 'Cuentas bancarias de las empresas.')} />
          <Route path="/catalogos/monedas"          element={cat('Monedas',          'Catálogo de monedas y tasas de cambio.')} />

          {/* Catálogos — Referencia Geográfica */}
          <Route path="/catalogos/departamentos" element={cat('Departamentos', 'Departamentos de Guatemala con tasas de retención.')} />
          <Route path="/catalogos/municipios"    element={cat('Municipios',    'Municipios por departamento de Guatemala.')} />

        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

