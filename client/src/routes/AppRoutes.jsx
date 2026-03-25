// Rutas de la aplicación con protección de acceso
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Páginas
import Login from '../pages/auth/Login'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'
import Dashboard from '../pages/dashboard/Dashboard'

// Protege rutas privadas — redirige a /login si no hay sesión
function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <svg className="animate-spin text-blue-600" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  )
  return usuario ? children : <Navigate to="/login" replace />
}

// Protege rutas públicas — redirige al dashboard si ya hay sesión activa
function RutaPublica({ children }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return null
  return !usuario ? children : <Navigate to="/" replace />
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (redirigen al dashboard si ya hay sesión) */}
        <Route path="/login" element={<RutaPublica><Login /></RutaPublica>} />
        <Route path="/forgot-password" element={<RutaPublica><ForgotPassword /></RutaPublica>} />

        {/* Ruta de reset — accesible sin sesión (viene del email de recuperación) */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas protegidas */}
        <Route path="/" element={<RutaProtegida><Dashboard /></RutaProtegida>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
