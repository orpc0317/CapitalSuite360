// Servidor principal de CapitalSuite360 — Node.js + Express
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PUERTO = process.env.PORT || 4000

// ─── Seguridad: headers HTTP ─────────────────────────────────────────────────
app.use(helmet())

// ─── CORS ─────────────────────────────────────────────────────────────────────
const origenesPermitidos = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origen (ej: Postman, scripts internos)
    if (!origin || origenesPermitidos.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`Origen no permitido por CORS: ${origin}`))
    }
  },
  credentials: true,
}))

// ─── Rate limiting global ─────────────────────────────────────────────────────
const limiterGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200,                  // máximo 200 peticiones por IP por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones. Intenta de nuevo en unos minutos.' },
})

// Rate limiting estricto para endpoints sensibles (auth, etc.)
// Se usará al registrar rutas de autenticación
const limiterAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' },
})

app.use(limiterGeneral)

// ─── Body parser ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })) // Limitar tamaño del body

// ─── Rutas ───────────────────────────────────────────────────────────────────
// Health check (sin rate limit, para monitoreo)
app.get('/api/health', (_req, res) => {
  res.json({ estado: 'ok', servicio: 'CapitalSuite360 API' })
})

// Registro de rutas del API (se irán agregando por módulo)
// import empresaRoutes from './src/routes/empresa.routes.js'
// app.use('/api/empresas', empresaRoutes)

// ─── Manejador global de errores ─────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // No exponer detalles internos en producción
  const esProduccion = process.env.NODE_ENV === 'production'
  console.error('[ERROR]', err.message)
  res.status(err.status || 500).json({
    error: esProduccion ? 'Error interno del servidor' : err.message,
  })
})

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO} [${process.env.NODE_ENV || 'development'}]`)
})
