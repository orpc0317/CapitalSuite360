// Hub de grupo — pantalla intermedia entre el launcher y el módulo CRUD
// Ruta: /catalogos/grupo/:groupId
// Lee el groupId de la URL, encuentra el grupo en navigation.js y muestra sus ítems como tiles.
import { useParams, Link, useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '../../utils/navigation'

// Los mismos colores de acento que ModuleTile para consistencia visual
const ACCENTS = {
  sky:     { bg: '#e0f2fe', stroke: '#0284c7', pill: '#bae6fd', text: '#0369a1' },
  emerald: { bg: '#d1fae5', stroke: '#059669', pill: '#a7f3d0', text: '#065f46' },
  violet:  { bg: '#ede9fe', stroke: '#7c3aed', pill: '#ddd6fe', text: '#5b21b6' },
  amber:   { bg: '#fef3c7', stroke: '#d97706', pill: '#fde68a', text: '#92400e' },
  teal:    { bg: '#ccfbf1', stroke: '#0d9488', pill: '#99f6e4', text: '#134e4a' },
  rose:    { bg: '#ffe4e6', stroke: '#e11d48', pill: '#fecdd3', text: '#9f1239' },
}

// Íconos por ítem (basados en la semántica del módulo)
const ITEM_ICONS = {
  'grupos-economicos': (
    <path d="M3 21h18M6 21V10M18 21V10M3 7l9-4 9 4M9 21v-5h6v5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  empresas: (
    <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>
  ),
  usuarios: (
    <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>
  ),
  proyectos: (
    <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>
  ),
  fases: (
    <><path d="M3 5h18M3 12h18M3 19h18" strokeLinecap="round" /></>
  ),
  manzanas: (
    <><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></>
  ),
  lotes: (
    <><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" strokeLinejoin="round" /></>
  ),
  supervisores: (
    <><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" /><path d="M12 12v4M10 14h4" strokeLinecap="round" /></>
  ),
  coordinadores: (
    <><circle cx="9" cy="8" r="3" /><path d="M6 21v-2a4 4 0 0 1 4-4h0" /><circle cx="17" cy="10" r="3" /><path d="M14 21v-2a4 4 0 0 1 4-4h2" /></>
  ),
  vendedores: (
    <><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>
  ),
  cobradores: (
    <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>
  ),
  clientes: (
    <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>
  ),
  bancos: (
    <><line x1="3" y1="21" x2="21" y2="21" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M5 6l7-3 7 3" /><line x1="6" y1="10" x2="6" y2="21" /><line x1="18" y1="10" x2="18" y2="21" /></>
  ),
  'cuentas-bancarias': (
    <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /><line x1="6" y1="15" x2="10" y2="15" /></>
  ),
  monedas: (
    <><circle cx="12" cy="12" r="9" /><path d="M14.8 9A2 2 0 0 0 13 8h-2a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9" /><path d="M12 6v2M12 16v2" /></>
  ),
  departamentos: (
    <><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></>
  ),
  municipios: (
    <><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></>
  ),
}

function ItemIcon({ id, stroke }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {ITEM_ICONS[id] ?? ITEM_ICONS.clientes}
    </svg>
  )
}

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
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke={accent.stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            {ITEM_ICONS[foundGroup.id] ?? ITEM_ICONS.clientes}
          </svg>
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
            {/* Ícono del ítem */}
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
              style={{ background: accent.bg }}>
              <ItemIcon id={item.id} stroke={accent.stroke} />
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
