// Servidor principal de CapitalSuite360 — Node.js + Express
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PUERTO = process.env.PORT || 4000

// Middlewares globales
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Ruta de health check
app.get('/api/health', (_req, res) => {
  res.json({ estado: 'ok', mensaje: 'CapitalSuite360 API activa' })
})

// Registro de rutas del API (se irán agregando por módulo)
// import empresaRoutes from './src/routes/empresa.routes.js'
// app.use('/api/empresas', empresaRoutes)

// Manejo global de errores no capturados
app.use((err, _req, res, _next) => {
  console.error('Error no manejado:', err.message)
  res.status(500).json({ error: 'Error interno del servidor' })
})

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
})
