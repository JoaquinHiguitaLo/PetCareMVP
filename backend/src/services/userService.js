const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


exports.registrarUsuario = async (data) => {
  const usuarioPorEmail = await userRepository.obtenerPorEmail(data.email);

  if (usuarioPorEmail) {
    throw new Error("Ya existe un usuario con ese correo");
  }

  const usuarioPorCedula = await userRepository.obtenerPorCedula(data.cedula);

  if (usuarioPorCedula) {
    throw new Error("Ya existe un usuario con esa cédula");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  return await userRepository.crear({
    nombre: data.nombre,
    cedula: data.cedula,
    email: data.email,
    telefono: data.telefono,
    passwordHash,
    rol: data.rol
  });
};

exports.solicitarCodigoReset = async (email) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  const expiracion = new Date(Date.now() + 15 * 60 * 1000);

  await userRepository.guardarCodigoReset(
    email,
    codigo,
    expiracion
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"PetCare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Código recuperación contraseña",
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Tu código es:</p>
      <h1>${codigo}</h1>
      <p>Expira en 15 minutos</p>
    `
  });

  return true;
};

exports.resetPassword = async (email, codigo, nuevaPassword) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  if (
    user.reset_code !== codigo ||
    new Date(user.reset_code_expires) < new Date()
  ) {
    throw new Error("Código inválido o expirado");
  }

  const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

  await userRepository.updatePassword(email, hashedPassword);

  await userRepository.limpiarCodigoReset(email);

  return true;
};