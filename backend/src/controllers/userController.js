const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const userService = require("../services/userService");

exports.registerUser = async (req, res) => {
  try {
    const user = await userService.registrarUsuario(req.body);

    res.json({
      message: "Usuario registrado correctamente",
      user
    });
  } catch (error) {
    console.error("ERROR REGISTRANDO USUARIO:", error);

    if (error.message === "Ya existe un usuario con ese correo") {
      return res.status(400).json({ error: error.message });
    }

    if (error.message === "Ya existe un usuario con esa cédula") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Error registrando usuario" });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        error: "Usuario no encontrado"
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        error: "Contraseña incorrecta"
      });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error en login"
    });

  }

};

exports.resetPassword = async (req, res) => {
  try {
    const { email, codigo, nuevaPassword } = req.body;

    if (!email || !codigo || !nuevaPassword) {
      return res.status(400).json({
        error: "Email, código y nueva contraseña son obligatorios"
      });
    }

    await userService.resetPassword(email, codigo, nuevaPassword);

    res.json({
      message: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    console.error(error);

    if (
      error.message === "Usuario no encontrado" ||
      error.message === "Código inválido o expirado"
    ) {
      return res.status(400).json({
        error: error.message
      });
    }

    res.status(500).json({
      error: "Error restableciendo contraseña"
    });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { id, nombre, telefono } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "ID de usuario requerido"
      });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET nombre = $1, telefono = $2
      WHERE id = $3
      RETURNING id, nombre, email, telefono, rol
      `,
      [nombre, telefono, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    res.json({
      message: "Perfil actualizado correctamente",
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error actualizando perfil"
    });
  }
};

exports.requestResetCode = async (req, res) => {
  try {
    await userService.solicitarCodigoReset(req.body.email);

    res.json({
      message: "Código enviado al correo"
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};