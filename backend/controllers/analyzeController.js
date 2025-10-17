
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


