// Shell principal de la aplicación para rutas protegidas
// Compone: Sidebar izquierdo + Header superior + área de contenido (Outlet)

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div
      style={{ background: 'var(--cs-bg-page)' }}
      className="flex h-screen overflow-hidden"
    >
      {/* Sidebar izquierdo */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Área principal: header + contenido */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onMenuToggle={() => setMobileMenuOpen(true)} />

        {/* Área de contenido — cada página se renderiza aquí via <Outlet> */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
