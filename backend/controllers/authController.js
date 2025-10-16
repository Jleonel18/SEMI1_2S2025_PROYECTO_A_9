const db = require('../db');
const cognito = require('../middlewares/cognito');
const { SignUpCommand, InitiateAuthCommand } = require('@aws-sdk/client-cognito-identity-provider');
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
      address
    } = req.body;

    // 1. Registrar usuario en Cognito
    const cognitoParams = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email }
      ]
    };

    const command = new SignUpCommand(cognitoParams);
    await cognito.send(command);

    // 2. Guardar datos adicionales en PostgreSQL
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO Usuario (Usuario, Nombre, Contrasena, email, emergency_email, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING Id_Usuario, Usuario, email`,
      [username, fullName, hash, email, emergencyEmail, phone, address]
    );

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Error en register:', err);
    if (err.name === 'UsernameExistsException') {
      return res.status(400).json({ error: 'El usuario ya existe en Cognito' });
    }
    res.status(500).json({ error: 'Error al registrar usuario: ' + err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Autenticar usuario en Cognito
    const cognitoParams = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    };

    const command = new InitiateAuthCommand(cognitoParams);
    const cognitoResponse = await cognito.send(command);

    // 2. Obtener tokens de Cognito
    const accessToken = cognitoResponse.AuthenticationResult.AccessToken;
    const idToken = cognitoResponse.AuthenticationResult.IdToken;
    const refreshToken = cognitoResponse.AuthenticationResult.RefreshToken;

    // 3. Buscar usuario en la base de datos
    const result = await db.query('SELECT * FROM Usuario WHERE Usuario = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado en la base de datos' });
    }

    const user = result.rows[0];

    // generar token jwt
    const jwtPayload = { id_usuario: user.id_usuario, usuario: user.usuario, email: user.email };
    const jwtOptions = { expiresIn: '2h' };
    const jwtSecret = process.env.JWT_SECRET;
    const jwtToken = jwt.sign(jwtPayload, jwtSecret, jwtOptions);

    res.json({
      message: 'Inicio de sesión correcto',
      token: idToken,
      refreshToken,
      jwtToken,
      user: {
        id: user.id_usuario,
        username: user.usuario,
        email: user.email,
        foto: user.foto
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    if (err.name === 'NotAuthorizedException') {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    if (err.name === 'UserNotFoundException') {
      return res.status(404).json({ error: 'Usuario no encontrado en Cognito' });
    }
    res.status(500).json({ error: 'Error interno al iniciar sesión: ' + err.message });
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    console.log("aqui", req.body)
    const { username, photo } = req.body;
    const result = await db.query(
      'UPDATE Usuario SET Foto = $1 WHERE Usuario = $2 RETURNING Id_Usuario, Usuario, email, Foto',
      [photo, username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({
      message: 'Foto actualizada correctamente',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Error en updatePhoto:', err);
    res.status(500).json({ error: 'Error al actualizar la foto: ' + err.message });
  }
}