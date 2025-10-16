const db = require('../db');

exports.uploadFile = async (req, res) => {
  try {
    const { id_usuario } = req.user;
    const { fileKey } = req.body;
    const result = await db.query(
        `INSERT INTO files (User_Id, file_key, file_type)
         VALUES ($1, $2, 'audio') RETURNING *`,
        [id_usuario, fileKey]
    );
    res.status(201).json({ file: result.rows[0] });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
