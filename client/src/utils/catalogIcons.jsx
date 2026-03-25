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

// ─── Íconos por ítem de módulo ────────────────────────────────────────────────
// Paths SVG estilo Lucide (licencia MIT — libre para uso comercial)
// https://lucide.dev/license
function ItemIconPaths({ id }) {
  switch (id) {
    // ── Organización ──────────────────────────────────────────────────────────
    case 'grupos-economicos':
      // Network / jerarquía corporativa
      return (
        <>
          <rect x="16" y="16" width="6" height="6" rx="1" />
          <rect x="2" y="16" width="6" height="6" rx="1" />
          <rect x="9" y="2" width="6" height="6" rx="1" />
          <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
          <path d="M12 12V8" />
        </>
      )
    case 'empresas':
      // Building-2 (edificio de oficinas)
      return (
        <>
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
          <path d="M10 6h4" />
          <path d="M10 10h4" />
          <path d="M10 14h4" />
          <path d="M10 18h4" />
        </>
      )
    case 'usuarios':
      // User-cog (usuario con configuración)
      return (
        <>
          <circle cx="18" cy="15" r="3" />
          <path d="M18 12a6 6 0 1 0-6 6" />
          <path d="m21.7 16.4-.9-.3" />
          <path d="m15.2 13.9-.9-.3" />
          <path d="m16.6 21.7.3-.9" />
          <path d="m19.1 15.2.3-.9" />
          <path d="m19.6 21.7-.4-1" />
          <path d="m16.8 15.3-.4-1" />
          <path d="m14.3 19.6 1-.4" />
          <path d="m20.7 17.8 1-.4" />
        </>
      )
    // ── Proyectos ─────────────────────────────────────────────────────────────
    case 'proyectos':
      // Layers
      return (
        <>
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
        </>
      )
    case 'fases':
      // List-ordered (etapas secuenciales)
      return (
        <>
          <path d="M10 6h11" />
          <path d="M10 12h11" />
          <path d="M10 18h11" />
          <path d="M4 6h1v4" />
          <path d="M4 10h2" />
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
        </>
      )
    case 'manzanas':
      // Grid-2x2 (manzanas = bloques de terreno)
      return (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </>
      )
    case 'lotes':
      // Maximize-2 / square con subdivisiones (lotes individuales)
      return (
        <>
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="12" y1="3" x2="12" y2="21" />
        </>
      )
    // ── Personal ──────────────────────────────────────────────────────────────
    case 'supervisores':
      // User con escudo / insignia de autoridad
      return (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21a8 8 0 1 0-16 0" />
          <path d="M12 12v2" />
          <path d="M9 15h6" />
        </>
      )
    case 'coordinadores':
      // Users con enlace
      return (
        <>
          <path d="M14 19a6 6 0 0 0-12 0" />
          <circle cx="8" cy="9" r="4" />
          <path d="M22 19a6 6 0 0 0-6-6 4 4 0 0 0 0-8" />
        </>
      )
    case 'vendedores':
      // Tag (etiqueta de venta)
      return (
        <>
          <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
          <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
        </>
      )
    case 'cobradores':
      // Receipt (recibo de cobro)
      return (
        <>
          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
          <path d="M14 8H8" />
          <path d="M16 12H8" />
          <path d="M13 16H8" />
        </>
      )
    // ── Clientes ──────────────────────────────────────────────────────────────
    case 'clientes':
      // Contact / persona con tarjeta
      return (
        <>
          <path d="M16 2v2" />
          <path d="M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
          <path d="M8 22v-2" />
          <path d="M16 22v-2" />
          <circle cx="12" cy="11" r="3" />
          <rect x="2" y="2" width="20" height="20" rx="5" />
        </>
      )
    // ── Finanzas ──────────────────────────────────────────────────────────────
    case 'bancos':
      // Landmark (columnas de banco)
      return (
        <>
          <line x1="3" y1="22" x2="21" y2="22" />
          <line x1="6" y1="18" x2="6" y2="11" />
          <line x1="10" y1="18" x2="10" y2="11" />
          <line x1="14" y1="18" x2="14" y2="11" />
          <line x1="18" y1="18" x2="18" y2="11" />
          <polyline points="3 11 12 2 21 11" />
        </>
      )
    case 'cuentas-bancarias':
      // Credit-card
      return (
        <>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
          <line x1="6" y1="15" x2="10" y2="15" />
        </>
      )
    case 'monedas':
      // Coin / DollarSign en círculo
      return (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v2" />
          <path d="M12 16v2" />
          <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4" />
          <path d="M10 14.5h.01" strokeWidth="2.5" />
        </>
      )
    // ── Referencia Geográfica ─────────────────────────────────────────────────
    case 'departamentos':
      // Map (mapa de región)
      return (
        <>
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </>
      )
    case 'municipios':
      // Map-pin (punto en mapa)
      return (
        <>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
          <line x1="6" y1="22" x2="18" y2="22" />
        </>
      )
    default:
      return <circle cx="12" cy="12" r="9" />
  }
}

// Ícono de ítem (módulo individual dentro de un grupo)
// Todos los paths son estilo Lucide — MIT License, libre para uso comercial
export function ItemIcon({ id, stroke, size = 20 }) {
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
      <ItemIconPaths id={id} />
    </svg>
  )
}
