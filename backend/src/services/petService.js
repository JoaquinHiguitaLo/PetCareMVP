const petRepository = require("../repositories/petRepository");

exports.crearMascota = async (data) => {
  return await petRepository.crear(data);
};

exports.obtenerMascotasPorUsuario = async (userId) => {
  return await petRepository.obtenerPorUsuario(userId);
};

exports.actualizarMascota = async (id, data) => {
  const existente = await petRepository.obtenerPorId(id);

  if (!existente) {
    throw new Error("Mascota no encontrada");
  }

  return await petRepository.actualizar(id, data);
};

exports.eliminarMascota = async (id) => {
  const existente = await petRepository.obtenerPorId(id);

  if (!existente) {
    throw new Error("Mascota no encontrada");
  }

  return await petRepository.eliminar(id);
};