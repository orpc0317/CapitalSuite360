// Dashboard principal — página de inicio tras el login
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabaseClient'

export default function Dashboard() {
  const { usuario } = useAuth()

  async function manejarLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">CapitalSuite360</h1>
          <button
            onClick={manejarLogout}
            className="text-sm bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg transition"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Bienvenido</h2>
          <p className="text-gray-500 text-sm">{usuario?.email}</p>
        </div>

        {/* Aquí se agregarán las métricas y módulos del dashboard */}
      </div>
    </div>
  )
}
