const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");

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