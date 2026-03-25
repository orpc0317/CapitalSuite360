// Página de Login — autenticación con Supabase Auth
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'

export default function Login() {
  const location = useLocation()

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [error, setError] = useState(null)
  // Inicializar con el mensaje de éxito si viene del flujo de reset de contraseña
  const [exito, setExito] = useState(
    location.state?.resetExitoso ? 'Contraseña actualizada. Ya puedes iniciar sesión.' : null
  )
  const [cargando, setCargando] = useState(false)

  // Mostrar mensaje de éxito al volver del flujo de reset
  // (ya inicializado en useState; mantenemos setExito para poder ocultarlo)

  function traducirError(mensaje) {
    if (!mensaje) return 'Ocurrió un error. Intenta de nuevo.'
    const m = mensaje.toLowerCase()
    if (m.includes('invalid login credentials') || m.includes('invalid credentials'))
      return 'Correo o contraseña incorrectos.'
    if (m.includes('email not confirmed'))
      return 'Debes verificar tu correo antes de ingresar.'
    if (m.includes('too many requests'))
      return 'Demasiados intentos. Espera unos minutos e intenta de nuevo.'
    if (m.includes('network') || m.includes('fetch'))
      return 'Error de conexión. Verifica tu internet.'
    return 'Ocurrió un error. Intenta de nuevo.'
  }

  async function manejarLogin(e) {
    e.preventDefault()
    setCargando(true)
    setError(null)
    setExito(null)

    const { error: errorAuth } = await supabase.auth.signInWithPassword({
      email: correo.trim(),
      password: contrasena,
    })

    if (errorAuth) {
      setError(traducirError(errorAuth.message))
    }
    // Si no hay error, onAuthStateChange en AuthContext actualiza la sesión
    // y el useEffect de arriba redirige al dashboard
    setCargando(false)
  }

  return (
    <div className="min-h-screen flex">

      {/* Panel izquierdo — branding (solo desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 to-indigo-900 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 9L12 3L21 9V21H15V15H9V21H3V9Z" fill="white" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">CapitalSuite360</span>
        </div>

        <div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Gestión integral de<br />lotificación de terrenos
          </h2>
          <p className="text-blue-200 text-lg">
            Control total de proyectos, lotes, clientes y facturación en una sola plataforma.
          </p>
          <div className="mt-10 flex gap-10">
            <div>
              <p className="text-white text-3xl font-bold">360°</p>
              <p className="text-blue-300 text-sm">Visión completa</p>
            </div>
            <div>
              <p className="text-white text-3xl font-bold">Multi</p>
              <p className="text-blue-300 text-sm">empresa</p>
            </div>
            <div>
              <p className="text-white text-3xl font-bold">FEL</p>
              <p className="text-blue-300 text-sm">SAT Guatemala</p>
            </div>
          </div>
        </div>

        <p className="text-blue-400 text-sm">© 2026 CapitalSuite360. Todos los derechos reservados.</p>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">

          {/* Logo solo en móvil */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 3L21 9V21H15V15H9V21H3V9Z" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-800">CapitalSuite360</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h1>
            <p className="text-gray-500">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={manejarLogin} className="flex flex-col gap-5">

            {/* Campo correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="usuario@empresa.com"
                />
              </div>
            </div>

            {/* Campo contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type={mostrarContrasena ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {mostrarContrasena ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mensaje de éxito (ej: tras reset de contraseña) */}
            {exito && (
              <div className="flex items-start gap-2.5 p-3 bg-green-50 border border-green-200 rounded-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600 mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <p className="text-sm text-green-700">{exito}</p>
              </div>
            )}

            {/* Mensaje de error */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 mt-0.5 flex-shrink-0">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Botón de ingreso */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {cargando ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Ingresando...
                </>
              ) : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
