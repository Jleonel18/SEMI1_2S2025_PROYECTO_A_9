const db = require('../db');
const jwt = require('jsonwebtoken');

// ✅ Verifica el token local (HS256)
function verifyLocalToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Token inválido o expirado');
  }
}

// 🧩 POST /api/save-mood
exports.saveMood = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: 'Falta encabezado Authorization' });

    const token = authHeader.split(' ')[1];
    const decoded = verifyLocalToken(token);

    const username = decoded.username || decoded.email;
    if (!username)
      throw new Error('No se pudo obtener username o email del token');

    const { puntuacion, nota } = req.body;
    if (!puntuacion) {
      return res.status(400).json({ error: 'Debe incluir una puntuación' });
    }

    // 🔍 Buscar usuario por nombre o correo
    const userResult = await db.query(
      'SELECT id_usuario FROM usuario WHERE usuario = $1 OR email = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado en base de datos' });
    }

    const user_id = userResult.rows[0].id_usuario;

    // 💾 Guardar mood
    const insertResult = await db.query(
      `INSERT INTO mood (user_id, puntuacion, nota)
       VALUES ($1, $2, $3)
       RETURNING id_mood, to_char(fecha, 'YYYY-MM-DD') as fecha, puntuacion, nota`,
      [user_id, puntuacion, nota || null]
    );

    res.status(201).json({
      message: 'Humor registrado correctamente',
      mood: insertResult.rows[0],
    });
  } catch (err) {
    console.error('Error en saveMood:', err);
    res.status(500).json({ error: 'Error al guardar el humor: ' + err.message });
  }
};

// 📊 GET /api/get-history
exports.getHistory = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: 'Falta encabezado Authorization' });

    const token = authHeader.split(' ')[1];
    const decoded = verifyLocalToken(token);

    const username = decoded.username || decoded.email;
    if (!username)
      throw new Error('No se pudo obtener username o email del token');

    const userResult = await db.query(
      'SELECT id_usuario FROM usuario WHERE usuario = $1 OR email = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado en base de datos' });
    }

    const user_id = userResult.rows[0].id_usuario;

    // 🔎 Obtener historial de moods con fecha formateada
    const result = await db.query(
      `SELECT to_char(fecha, 'YYYY-MM-DD') as fecha, puntuacion, nota
       FROM mood
       WHERE user_id = $1
       ORDER BY fecha ASC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error en getHistory:', err);
    res.status(500).json({ error: 'Error al obtener historial: ' + err.message });
  }
};
