// Barra superior de la aplicación
// Por ahora contiene: hamburger (móvil) + área para breadcrumb/título futuro

export default function Header({ onMenuToggle }) {
  return (
    <header
      style={{
        height: 'var(--cs-header-height)',
        background: 'var(--cs-header-bg)',
      }}
      className="flex items-center px-4 gap-3 shrink-0 border-b border-gray-200 shadow-sm"
    >
      {/* Botón hamburger — solo visible en móvil */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Abrir menú"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Espacio para breadcrumb / título de página (se implementará más adelante) */}
      <div className="flex-1" />

      {/* Espacio reservado para: notificaciones, selector de empresa, avatar */}
    </header>
  )
}
