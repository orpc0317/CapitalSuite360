// Landing page principal — Launcher de módulos basado en accesos del usuario
import { useAuth } from '../../context/AuthContext'
import { NAV_ITEMS } from '../../utils/navigation'
import ModuleTile from '../../components/common/ModuleTile'

function saludo() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function Dashboard() {
  const { usuario } = useAuth()
  const nombre = usuario?.email?.split('@')[0] ?? 'Usuario'

  // Secciones con grupos (origen de los tiles)
  const sections = NAV_ITEMS.filter(n => n.type === 'section' && n.groups?.length > 0)

  return (
    <div className="p-6 lg:p-8 max-w-7xl">

      {/* Encabezado de bienvenida */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900">
          {saludo()},{' '}
          <span style={{ color: 'var(--cs-brand-600)' }}>{nombre}</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Selecciona un módulo para comenzar a trabajar.
        </p>
      </div>

      {/* Launcher: una sección por cada grupo principal del menú */}
      {sections.map(section => (
        <div key={section.id} className="mb-10">

          {/* Encabezado de sección */}
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
              {section.label}
            </h2>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Grid de tiles */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {section.groups.map(group => (
              <ModuleTile key={group.id} group={group} />
            ))}
          </div>

        </div>
      ))}

    </div>
  )
}

