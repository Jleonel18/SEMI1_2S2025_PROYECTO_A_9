const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      emergencyEmail,
      password,
      phone,
      address,
      photo
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO Usuario (Usuario, Nombre, Contrasena, email, emergency_email, phone, address, Foto)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING Id_Usuario, Usuario, email`,
      [username, fullName, hash, email, emergencyEmail, phone, address, photo]
    );

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Error en register:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await db.query('SELECT * FROM Usuario WHERE Usuario=$1', [username]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.contrasena);

    if (!match)
      return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      {
        id: user.id_usuario,
        username: user.usuario,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.json({
      message: 'Inicio de sesión correcto',
      token,
      user: {
        id: user.id_usuario,
        username: user.usuario,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno al iniciar sesión' });
  }
};
