const db = require('../db');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');

let cognitoJWKs = null;

// 🔐 Descargar claves públicas de Cognito una sola vez
async function getCognitoJWKs() {
  if (cognitoJWKs) return cognitoJWKs;
  const region = process.env.AWS_REGION;
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  const response = await axios.get(url);
  cognitoJWKs = response.data.keys;
  return cognitoJWKs;
}

// ✅ Verificar el token y obtener datos del usuario
async function verifyIdToken(token) {
  const keys = await getCognitoJWKs();
  const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString('utf8'));
  const jwk = keys.find(k => k.kid === header.kid);
  if (!jwk) throw new Error('No se encontró la clave pública del token');

  const pem = jwkToPem(jwk);
  return new Promise((resolve, reject) => {
    jwt.verify(token, pem, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

// 🧩 POST /api/save-mood
exports.saveMood = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Falta encabezado Authorization' });

    const token = authHeader.split(' ')[1];
    const decoded = await verifyIdToken(token);

    // ✅ Obtener el identificador real del usuario
    const username = decoded['cognito:username'] || decoded['email'];
    if (!username) throw new Error('No se pudo obtener username o email del token');

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
       RETURNING id_mood, fecha, puntuacion, nota`,
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
    if (!authHeader) return res.status(401).json({ error: 'Falta encabezado Authorization' });

    const token = authHeader.split(' ')[1];
    const decoded = await verifyIdToken(token);

    const username = decoded['cognito:username'] || decoded['email'];
    if (!username) throw new Error('No se pudo obtener username o email del token');

    const userResult = await db.query(
      'SELECT id_usuario FROM usuario WHERE usuario = $1 OR email = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado en base de datos' });
    }

    const user_id = userResult.rows[0].id_usuario;

    const result = await db.query(
        `SELECT TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha,
                puntuacion,
                nota
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
