// Página placeholder para catálogos en desarrollo
// Se reemplazará con el mantenimiento real de cada catálogo en su momento

export default function PlaceholderCatalogo({ titulo, descripcion }) {
  return (
    <div className="p-6 lg:p-8">

      {/* Encabezado de la página */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{titulo}</h1>
        {descripcion && (
          <p className="text-gray-500 text-sm mt-1">{descripcion}</p>
        )}
      </div>

      {/* Área de contenido — en construcción */}
      <div className="flex items-center justify-center bg-white rounded-xl border border-dashed border-gray-300 p-12 max-w-2xl">
        <div className="text-center">
          {/* Ícono */}
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>

          <h2 className="text-base font-semibold text-gray-600 mb-1">
            Módulo en desarrollo
          </h2>
          <p className="text-sm text-gray-400">
            El mantenimiento de{' '}
            <strong className="text-gray-500">{titulo}</strong>{' '}
            estará disponible próximamente.
          </p>
        </div>
      </div>

    </div>
  )
}
