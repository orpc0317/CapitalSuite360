// Middleware de autenticación — verifica el JWT de Supabase Auth en cada request protegido
import { createClient } from '@supabase/supabase-js'

// Se crea un cliente con la anon key para verificar el token del usuario
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export async function verificarAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado — token no proporcionado' })
    }

    const token = authHeader.split(' ')[1]

    // Verificar el JWT con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido o expirado' })
    }

    // Adjuntar el usuario al request para uso en los controladores
    req.usuario = user
    next()
  } catch (err) {
    console.error('Error en verificarAuth:', err.message)
    res.status(500).json({ error: 'Error al verificar autenticación' })
  }
}
