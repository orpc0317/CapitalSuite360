// Rutas de la aplicación con protección de acceso
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Páginas
import Login from '../pages/auth/Login'
import Dashboard from '../pages/dashboard/Dashboard'

// Componente que protege rutas que requieren autenticación
function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return <div className="flex items-center justify-center h-screen">Cargando...</div>
  return usuario ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route path="/" element={<RutaProtegida><Dashboard /></RutaProtegida>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
