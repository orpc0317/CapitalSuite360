// Landing page principal — se muestra tras el login
import { useAuth } from '../../context/AuthContext'

export default function Dashboard() {
  const { usuario } = useAuth()

  // Extraer nombre amigable del email (parte antes del @)
  const nombre = usuario?.email?.split('@')[0] ?? 'Usuario'

  return (
    <div className="p-6 lg:p-8">

      {/* Bienvenida */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {nombre}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Este es tu panel de control. Usa el menú lateral para navegar.
        </p>
      </div>

      {/* Área reservada para métricas y KPIs */}
      <div className="max-w-4xl">
        <div className="flex items-center justify-center bg-white rounded-xl border border-dashed border-gray-300 p-12">
          <div className="text-center">
            <div
              style={{ background: 'var(--cs-brand-50)' }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 3L21 9V21H15V15H9V21H3V9Z" fill="var(--cs-brand-500)" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Dashboard en construcción
            </h2>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Aquí aparecerán métricas, KPIs y resúmenes del negocio.
              Por ahora, navega desde el menú lateral.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

