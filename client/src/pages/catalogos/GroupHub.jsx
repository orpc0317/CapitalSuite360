// Hub de grupo — pantalla intermedia entre el launcher y el módulo CRUD
// Ruta: /catalogos/grupo/:groupId
// Lee el groupId de la URL, encuentra el grupo en navigation.js y muestra sus ítems como tiles.
import { useParams, Link, useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '../../utils/navigation'
import { ACCENTS } from '../../utils/accentColors'
import { GroupIcon, ItemIcon } from '../../utils/catalogIcons'

export default function GroupHub() {
  const { groupId } = useParams()
  const navigate = useNavigate()

  // Encontrar la sección y el grupo en la estructura de navegación
  let foundGroup = null
  let foundSection = null
  for (const section of NAV_ITEMS) {
    if (section.type === 'section' && section.groups) {
      const g = section.groups.find(g => g.id === groupId)
      if (g) { foundGroup = g; foundSection = section; break }
    }
  }

  // Si no existe el grupo, redirige al inicio
  if (!foundGroup) {
    navigate('/', { replace: true })
    return null
  }

  const accent = ACCENTS[foundGroup.accent] ?? ACCENTS.sky

  return (
    <div className="p-6 lg:p-8 max-w-5xl">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-gray-600 transition-colors">Inicio</Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" /></svg>
        <span className="text-gray-400">{foundSection.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" /></svg>
        <span className="font-medium" style={{ color: accent.stroke }}>{foundGroup.label}</span>
      </nav>

      {/* Encabezado del grupo */}
      <div className="flex items-start gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: accent.bg }}>
          <GroupIcon name={foundGroup.icon} stroke={accent.stroke} size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{foundGroup.label}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{foundGroup.description}</p>
        </div>
      </div>

      {/* Grid de módulos del grupo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {foundGroup.items.map(item => (
          <Link
            key={item.id}
            to={item.path}
            className="group flex items-center gap-4 bg-white rounded-xl border border-gray-100
                       p-4 shadow-sm transition-all duration-200
                       hover:shadow-md hover:-translate-y-0.5 focus:outline-none
                       focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ '--tw-ring-color': accent.stroke }}
          >
            {/* Ícono único por módulo */}
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: accent.bg }}>
              <ItemIcon id={item.id} stroke={accent.stroke} size={20} />
            </div>

            {/* Nombre */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{item.label}</p>
              <p className="text-xs mt-0.5"
                style={{ color: accent.text }}>
                Abrir módulo
              </p>
            </div>

            {/* Flecha */}
            <svg className="w-4 h-4 text-gray-300 transition-colors duration-200 group-hover:text-gray-500 flex-shrink-0"
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>

    </div>
  )
}
