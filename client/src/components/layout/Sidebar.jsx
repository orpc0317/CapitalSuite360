// Sidebar de navegación principal — menú lateral izquierdo
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { NAV_ITEMS } from '../../utils/navigation'

// ─── Iconos inline (SVG) ─────────────────────────────────────────────────────
// Agregar nuevos íconos aquí y referenciarlos por ID en navigation.js

function IconDashboard() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function IconCatalogos() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconChevron({ open }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

// Mapa de íconos por ID (agregar nuevos íconos de menú aquí)
const ICONS = {
  dashboard: IconDashboard,
  catalogos: IconCatalogos,
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

// Calcula qué secciones y grupos deben aparecer expandidos al cargar la app,
// basándose en la ruta activa al momento del montaje.
function calcularExpandidos(pathname) {
  const sections = ['catalogos'] // Catálogos siempre inicia expandido
  const groups = []

  for (const item of NAV_ITEMS) {
    if (!item.groups) continue
    for (const group of item.groups) {
      const tieneActivo = group.items.some((i) => i.path === pathname)
      if (tieneActivo) {
        if (!sections.includes(item.id)) sections.push(item.id)
        if (!groups.includes(group.id)) groups.push(group.id)
      }
    }
  }

  return { sections, groups }
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const location = useLocation()
  const { usuario, cerrarSesion } = useAuth()

  // Estado inicial calculado una sola vez al montar, a partir de la ruta activa
  const [expandedSections, setExpandedSections] = useState(
    () => calcularExpandidos(location.pathname).sections
  )
  const [expandedGroups, setExpandedGroups] = useState(
    () => calcularExpandidos(location.pathname).groups
  )

  function toggleSection(id) {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  function toggleGroup(id) {
    setExpandedGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  // Inicial del usuario para el avatar
  const inicial = usuario?.email?.charAt(0)?.toUpperCase() ?? '?'

  return (
    <>
      {/* Overlay oscuro (móvil) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        style={{ width: 'var(--cs-sidebar-width)', background: 'var(--cs-sidebar-bg)' }}
        className={[
          'fixed top-0 left-0 h-full z-30',
          'flex flex-col shrink-0',
          'transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:z-auto',
        ].join(' ')}
        aria-label="Navegación principal"
      >
        {/* ── Marca / Logo ─────────────────────────────────────── */}
        <div
          style={{ height: 'var(--cs-header-height)', borderBottom: '1px solid var(--cs-sidebar-divider)' }}
          className="flex items-center gap-3 px-5 shrink-0"
        >
          <div
            style={{ background: 'var(--cs-brand-600)' }}
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 9L12 3L21 9V21H15V15H9V21H3V9Z" fill="white" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-none tracking-tight">
              CapitalSuite
            </p>
            <p style={{ color: 'var(--cs-sidebar-text)' }} className="text-xs mt-0.5">
              360
            </p>
          </div>
        </div>

        {/* ── Navegación ───────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            // Ítem simple (ej: Dashboard)
            if (item.type === 'item') {
              const Icon = ICONS[item.icon]
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium',
                      'transition-colors duration-150',
                      isActive
                        ? 'text-[var(--cs-sidebar-text-active)] bg-[var(--cs-sidebar-active-bg)]'
                        : 'text-[var(--cs-sidebar-text)] hover:bg-white/5 hover:text-[var(--cs-sidebar-text-hover)]',
                    ].join(' ')
                  }
                >
                  {Icon && <Icon />}
                  {item.label}
                </NavLink>
              )
            }

            // Sección expandible (ej: Catálogos)
            if (item.type === 'section') {
              const Icon = ICONS[item.icon]
              const isExpanded = expandedSections.includes(item.id)
              // Resaltar la sección si tiene un hijo activo pero está colapsada
              const tieneHijoActivo =
                !isExpanded &&
                item.groups?.some((g) =>
                  g.items.some((i) => i.path === location.pathname)
                )

              return (
                <div key={item.id}>
                  {/* Botón de la sección */}
                  <button
                    onClick={() => toggleSection(item.id)}
                    aria-expanded={isExpanded}
                    className={[
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium',
                      'transition-colors duration-150',
                      tieneHijoActivo
                        ? 'text-[var(--cs-sidebar-text-hover)]'
                        : 'text-[var(--cs-sidebar-text)] hover:bg-white/5 hover:text-[var(--cs-sidebar-text-hover)]',
                    ].join(' ')}
                  >
                    {Icon && <Icon />}
                    <span className="flex-1 text-left">{item.label}</span>
                    <IconChevron open={isExpanded} />
                  </button>

                  {/* Contenido expandido de la sección */}
                  {isExpanded && (
                    <div className="mt-1 ml-2 space-y-0.5">
                      {item.groups.map((group) => {
                        const isGroupExpanded = expandedGroups.includes(group.id)

                        return (
                          <div key={group.id}>
                            {/* Botón del sub-grupo */}
                            <button
                              onClick={() => toggleGroup(group.id)}
                              aria-expanded={isGroupExpanded}
                              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors duration-150 text-[var(--cs-sidebar-group-label)] hover:text-[var(--cs-sidebar-text-hover)]"
                            >
                              <span className="flex-1 text-left">{group.label}</span>
                              <IconChevron open={isGroupExpanded} />
                            </button>

                            {/* Ítems del grupo */}
                            {isGroupExpanded && (
                              <div className="mt-0.5 ml-2 space-y-0.5 pb-1">
                                {group.items.map((subItem) => (
                                  <NavLink
                                    key={subItem.id}
                                    to={subItem.path}
                                    onClick={onMobileClose}
                                    className={({ isActive }) =>
                                      [
                                        'flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm',
                                        'transition-colors duration-150',
                                        isActive
                                          ? 'bg-[var(--cs-sidebar-active-bg)] text-[var(--cs-sidebar-text-active)] font-medium'
                                          : 'text-[var(--cs-sidebar-text)] hover:bg-white/5 hover:text-[var(--cs-sidebar-text-hover)]',
                                      ].join(' ')
                                    }
                                  >
                                    {/* Punto indicador */}
                                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 shrink-0" />
                                    {subItem.label}
                                  </NavLink>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return null
          })}
        </nav>

        {/* ── Usuario / Cerrar sesión ───────────────────────────── */}
        <div
          style={{ borderTop: '1px solid var(--cs-sidebar-divider)' }}
          className="px-3 py-3 shrink-0"
        >
          <div className="flex items-center gap-3 px-2">
            {/* Avatar inicial */}
            <div
              style={{ background: 'var(--cs-brand-600)' }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            >
              {inicial}
            </div>
            {/* Email */}
            <p
              style={{ color: 'var(--cs-sidebar-text)' }}
              className="flex-1 text-xs truncate min-w-0"
              title={usuario?.email}
            >
              {usuario?.email}
            </p>
            {/* Botón logout */}
            <button
              onClick={cerrarSesion}
              style={{ color: 'var(--cs-sidebar-text)' }}
              className="hover:text-red-400 transition-colors shrink-0"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <IconLogout />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
