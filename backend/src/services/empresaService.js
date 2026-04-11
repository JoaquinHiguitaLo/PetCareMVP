const empresaRepository = require("../repositories/empresaRepository");

exports.crearEmpresa = async (data, usuario_id) => {
  const empresaPorDocumento = await empresaRepository.obtenerPorDocumento(data.documento);

  if (empresaPorDocumento) {
    throw new Error("Ya existe una empresa con ese documento");
  }

  const empresaPorCorreo = await empresaRepository.obtenerPorCorreo(data.correo);

  if (empresaPorCorreo) {
    throw new Error("Ya existe una empresa con ese correo");
  }

  return await empresaRepository.crear({
    usuario_id,
    nombre: data.nombre,
    nombre_propietario: data.nombre_propietario,
    documento: data.documento,
    direccion: data.direccion,
    telefono: data.telefono,
    correo: data.correo,
    descripcion: data.descripcion
  });
};

exports.obtenerEmpresasPorUsuario = async (usuario_id) => {
  return await empresaRepository.obtenerPorUsuario(usuario_id);
};

exports.eliminarEmpresa = async (id, usuario_id) => {
  const empresa = await empresaRepository.obtenerPorId(id);

  if (!empresa) {
    throw new Error("Empresa no encontrada");
  }

  if (empresa.usuario_id !== usuario_id) {
    throw new Error("No autorizado");
  }

  await empresaRepository.eliminar(id);
};

exports.obtenerEmpresasPorCategoria = async (categoria) => {
  return await empresaRepository.obtenerPorCategoria(categoria);
};

exports.obtenerDetalleEmpresa = async (id) => {
  return await empresaRepository.obtenerDetallePorId(id);
};

exports.actualizarEmpresa = async (id, data, usuario_id) => {
  const empresa = await empresaRepository.obtenerPorId(id);

  if (!empresa) {
    throw new Error("Empresa no encontrada");
  }

  if (empresa.usuario_id !== usuario_id) {
    throw new Error("No autorizado");
  }

  const existeDocumento = await empresaRepository.obtenerPorDocumento(data.documento);

  if (existeDocumento && Number(existeDocumento.id) !== Number(id)) {
    throw new Error("Ya existe una empresa con ese documento");
  }

  const existeCorreo = await empresaRepository.obtenerPorCorreo(data.correo);

  if (existeCorreo && Number(existeCorreo.id) !== Number(id)) {
    throw new Error("Ya existe una empresa con ese correo");
  }

  return await empresaRepository.actualizar(id, data);
};