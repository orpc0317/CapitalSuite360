// Tile individual del launcher de módulos
// Cada tile representa un grupo funcional del sistema
import { Link } from 'react-router-dom'
import { ACCENTS } from '../../utils/accentColors'
import { GroupIcon } from '../../utils/catalogIcons'

export default function ModuleTile({ group }) {
  const accent = ACCENTS[group.accent] ?? ACCENTS.sky
  const destino = `/catalogos/grupo/${group.id}`
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
