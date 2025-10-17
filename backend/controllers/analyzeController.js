
/*
tabla para guardar 
CREATE TABLE analyses (
    id_analyses SERIAL PRIMARY KEY,
    file_id INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,  -- FK a file subido
    User_Id INTEGER NOT NULL REFERENCES Usuario(Id_Usuario) ON DELETE CASCADE,
    statusAnalysis TEXT ,
    sentiment_result JSONB,  -- Resultado de Comprehend (ej. {"Sentiment": "NEGATIVE", "Scores": {...}})
    transcription TEXT,  -- Texto transcrito de Transcribe (para audios)
    recommendation TEXT,  -- Recomendación generada (ej. 'Prueba ejercicio de respiración')
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

*/

const db = require('../db');
const jwt = require('jsonwebtoken');



function verifyLocalToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Token inválido o expirado');
  }
}




exports.guardarAnalisis = async (req, res) => {
  try {
    const { file_id, status, sentiment_result, transcription, recommendation } = req.body;
    console.log('Datos recibidos:', { file_id, status, sentiment_result, transcription, recommendation }); // Log para depurar
    const result = await db.query(
      'INSERT INTO analyses (file_id, User_Id, statusAnalysis, sentiment_result, transcription, recommendation) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [file_id, req.user.id_usuario, status, sentiment_result, transcription, recommendation]
    );
    res.status(201).json({ message: 'Análisis guardado', analysis: result.rows[0] });
  } catch (err) {
    console.error('Error guardando análisis:', err.stack); // Muestra el stack trace
    res.status(500).json({ error: 'Error guardando análisis', details: err.message });
  }
};


exports.getUserAnalyses = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: 'Falta encabezado Authorization' });

    const token = authHeader.split(' ')[1];
    const decoded = verifyLocalToken(token);

    const username = decoded.username || decoded.email;
    if (!username)
      throw new Error('No se pudo obtener username o email del token');

    // 🔍 Buscar usuario por nombre o correo
    const userResult = await db.query(
      'SELECT id_usuario FROM usuario WHERE usuario = $1 OR email = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado en base de datos' });
    }

    const user_id = userResult.rows[0].id_usuario;

    // 🔎 Obtener análisis del usuario con fecha formateada
    const result = await db.query(
      `SELECT a.id_analyses, a.statusAnalysis, a.sentiment_result, a.transcription, a.recommendation, 
              to_char(a.analysis_date, 'YYYY-MM-DD HH24:MI:SS') as analysis_date, f.file_key
       FROM analyses a
       JOIN files f ON a.file_id = f.Id_File -- Corrección: Usar Id_File en lugar de id
       WHERE a.User_Id = $1
       ORDER BY a.analysis_date DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error en getUserAnalyses:', err);
    res.status(500).json({ error: 'Error al obtener análisis: ' + err.message });
  }
};