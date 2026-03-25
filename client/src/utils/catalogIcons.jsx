// Ícono SVG de grupo — fuente única de verdad para tiles y hubs
// Importado por ModuleTile.jsx y GroupHub.jsx para garantizar consistencia visual

// Paths SVG internos por ID de grupo
function GroupIconPaths({ name, stroke }) {
  switch (name) {
    case 'organizacion':
      return (
        <>
          <path d="M3 21h18" />
          <path d="M6 21V10" />
          <path d="M18 21V10" />
          <path d="M3 7l9-4 9 4" />
          <path d="M9 21v-5h6v5" />
          <rect x="8.5" y="11" width="2" height="2" rx="0.5" fill={stroke} stroke="none" />
          <rect x="13.5" y="11" width="2" height="2" rx="0.5" fill={stroke} stroke="none" />
        </>
      )
    case 'proyectos':
      return (
        <>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </>
      )
    case 'personal':
      return (
        <>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      )
    case 'clientes':
      return (
        <>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>
      )
    case 'finanzas':
      return (
        <>
          <line x1="3" y1="21" x2="21" y2="21" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M5 6l7-3 7 3" />
          <line x1="6" y1="10" x2="6" y2="21" />
          <line x1="10" y1="10" x2="10" y2="21" />
          <line x1="14" y1="10" x2="14" y2="21" />
          <line x1="18" y1="10" x2="18" y2="21" />
        </>
      )
    case 'referencia':
      return (
        <>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </>
      )
    default:
      return <circle cx="12" cy="12" r="9" />
  }
}

// Componente listo para usar — tamaño configurable
export function GroupIcon({ name, stroke, size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <GroupIconPaths name={name} stroke={stroke} />
    </svg>
  )
}
