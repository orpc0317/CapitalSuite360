// Tile individual del launcher de módulos
// Cada tile representa un grupo funcional del sistema
import { Link } from 'react-router-dom'

// Mapa de colores por accent — bg del ícono y color del stroke/texto
const ACCENTS = {
  sky:     { bg: '#e0f2fe', stroke: '#0284c7' },
  emerald: { bg: '#d1fae5', stroke: '#059669' },
  violet:  { bg: '#ede9fe', stroke: '#7c3aed' },
  amber:   { bg: '#fef3c7', stroke: '#d97706' },
  teal:    { bg: '#ccfbf1', stroke: '#0d9488' },
  rose:    { bg: '#ffe4e6', stroke: '#e11d48' },
  indigo:  { bg: '#e0e7ff', stroke: '#4f46e5' },
  orange:  { bg: '#ffedd5', stroke: '#ea580c' },
}

// Íconos SVG outline por grupo
function GroupIcon({ name, stroke }) {
  const icons = {
    organizacion: (
      <>
        <path d="M3 21h18" />
        <path d="M6 21V10" />
        <path d="M18 21V10" />
        <path d="M3 7l9-4 9 4" />
        <path d="M9 21v-5h6v5" />
        <rect x="8.5" y="11" width="2" height="2" rx="0.5" fill={stroke} stroke="none" />
        <rect x="13.5" y="11" width="2" height="2" rx="0.5" fill={stroke} stroke="none" />
      </>
    ),
    proyectos: (
      <>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </>
    ),
    personal: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    clientes: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    finanzas: (
      <>
        <line x1="3" y1="21" x2="21" y2="21" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M5 6l7-3 7 3" />
        <line x1="6" y1="10" x2="6" y2="21" />
        <line x1="10" y1="10" x2="10" y2="21" />
        <line x1="14" y1="10" x2="14" y2="21" />
        <line x1="18" y1="10" x2="18" y2="21" />
      </>
    ),
    referencia: (
      <>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </>
    ),
  }

  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name] ?? icons.clientes}
    </svg>
  )
}

export default function ModuleTile({ group }) {
  const accent = ACCENTS[group.accent] ?? ACCENTS.sky
  const destino = group.items[0]?.path ?? '/'
  const count = group.items.length

  return (
    <Link
      to={destino}
      className="group block focus:outline-none"
    >
      <div
        className="h-full bg-white rounded-2xl border border-gray-100 p-5
                   shadow-sm transition-all duration-200
                   group-hover:shadow-lg group-hover:-translate-y-1
                   group-focus-visible:ring-2 group-focus-visible:ring-offset-2"
        style={{ '--tw-ring-color': accent.stroke }}
      >
        {/* Ícono */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: accent.bg }}
        >
          <GroupIcon name={group.icon} stroke={accent.stroke} />
        </div>

        {/* Título */}
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1.5">
          {group.label}
        </h3>

        {/* Descripción */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {group.description}
        </p>

        {/* Footer: conteo + flecha */}
        <div className="mt-4 flex items-center justify-between">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: accent.bg, color: accent.stroke }}
          >
            {count} {count === 1 ? 'módulo' : 'módulos'}
          </span>
          <svg
            className="w-4 h-4 text-gray-300 transition-colors duration-200 group-hover:text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
