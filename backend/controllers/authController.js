const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbQuery } = require('../database');
require('dotenv').config();

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Todos los campos (username, email, password) son obligatorios.' 
    });
  }

  if (username.length < 3) {
    return res.status(400).json({ 
      success: false, 
      message: 'El nombre de usuario debe tener al menos 3 caracteres.' 
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Formato de correo electrónico inválido.' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: 'La contraseña debe tener al menos 6 caracteres.' 
    });
  }

  try {
    const existingUser = await dbQuery.get(
      'SELECT id FROM usuarios WHERE usuario = ? OR correo = ?',
      [username, email]
    );

    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'El nombre de usuario o correo electrónico ya está en uso.' 
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await dbQuery.run(
      `INSERT INTO usuarios (usuario, correo, contrasena_hash, rol) 
       VALUES (?, ?, ?, 'user')`,
      [username.trim(), email.toLowerCase().trim(), passwordHash]
    );

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente. Ahora puedes iniciar sesión.',
      data: {
        id: result.id,
        username: username.trim(),
        email: email.toLowerCase().trim()
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Ocurrió un error en el servidor al registrar el usuario.' 
    });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Usuario/correo y contraseña son obligatorios.' 
    });
  }

  try {
    const user = await dbQuery.get(
      `SELECT * FROM usuarios WHERE usuario = ? OR correo = ?`,
      [identifier.trim(), identifier.toLowerCase().trim()]
    );

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario, correo o contraseña incorrectos.' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.contrasena_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario, correo o contraseña incorrectos.' 
      });
    }

    const tokenPayload = {
      id: user.id,
      username: user.usuario,
      email: user.correo,
      role: user.rol
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'turing_tech_store_default_secret',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      data: {
        token,
        user: {
          id: user.id,
          username: user.usuario,
          email: user.correo,
          role: user.rol
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Ocurrió un error interno en el servidor al iniciar sesión.' 
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await dbQuery.get(
      `SELECT id, usuario as username, correo as email, rol as role 
       FROM usuarios 
       WHERE id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Perfil de usuario no encontrado.' 
      });
    }

    return res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Ocurrió un error interno en el servidor.' 
    });
  }
};

