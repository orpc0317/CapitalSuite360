// Página de recuperación de contraseña — envía enlace por correo via Supabase Auth
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'

export default function ForgotPassword() {
  const [correo, setCorreo] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  async function manejarEnvio(e) {
    e.preventDefault()
    setCargando(true)
    setError(null)

    const { error: errorAuth } = await supabase.auth.resetPasswordForEmail(
      correo.trim(),
      { redirectTo: `${window.location.origin}/reset-password` }
    )

    if (errorAuth) {
      setError('No se pudo enviar el correo. Intenta de nuevo.')
    } else {
      setEnviado(true)
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 9L12 3L21 9V21H15V15H9V21H3V9Z" fill="white" />
            </svg>
          </div>
          <span className="font-bold text-xl text-gray-800">CapitalSuite360</span>
        </div>

        {enviado ? (
          /* Estado: correo enviado */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Revisa tu correo</h2>
            <p className="text-gray-500 text-sm mb-6">
              Enviamos un enlace de recuperación a <strong>{correo}</strong>.
              El enlace expira en 1 hora.
            </p>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          /* Formulario de envío */
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Recuperar contraseña</h1>
              <p className="text-gray-500">
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <form onSubmit={manejarEnvio} className="flex flex-col gap-5">

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
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="usuario@empresa.com"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 mt-0.5 flex-shrink-0">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {cargando ? (
                    <>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Enviando...
                    </>
                  ) : 'Enviar enlace de recuperación'}
                </button>
              </form>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                ← Volver al inicio de sesión
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
