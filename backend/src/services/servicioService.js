const servicioRepository = require("../repositories/servicioRepository");

exports.crearServicio = async (data, usuario_id) => {
  const empresa = await servicioRepository.obtenerEmpresaPorId(data.empresa_id);

  if (!empresa) {
    throw new Error("Empresa no encontrada");
  }

  if (empresa.usuario_id !== usuario_id) {
    throw new Error("No autorizado");
  }

  const existente = await servicioRepository.obtenerPorEmpresaYNombre(
    data.empresa_id,
    data.nombre
  );

  if (existente) {
    throw new Error("Ya existe un servicio con ese nombre en esta empresa");
  }

  return await servicioRepository.crear({
    empresa_id: data.empresa_id,
    nombre: data.nombre,
    descripcion: data.descripcion,
    precio: data.precio,
    foto: data.foto || "",
    disponible: data.disponible ?? true
  });
};

exports.obtenerServiciosPorEmpresa = async (empresaId) => {
  return await servicioRepository.obtenerPorEmpresa(empresaId);
};

exports.obtenerTodosLosServicios = async () => {
  return await servicioRepository.obtenerTodos();
};

exports.eliminarServicio = async (id, usuario_id) => {
  const servicio = await servicioRepository.obtenerPorId(id);

  if (!servicio) {
    throw new Error("Servicio no encontrado");
  }

  if (servicio.usuario_id !== usuario_id) {
    throw new Error("No autorizado");
  }

  return await servicioRepository.eliminar(id);
};

exports.obtenerPorEmpresaYNombre = async (empresaId, nombre) => {
  const result = await pool.query(
    "SELECT * FROM servicios WHERE empresa_id = $1 AND nombre = $2",
    [empresaId, nombre]
  );

  return result.rows[0];
};

exports.obtenerServiciosPorEmpresa = async (empresaId) => {
  return await servicioRepository.obtenerServiciosPorEmpresa(empresaId);
};

exports.actualizarServicio = async (id, data, usuario_id) => {
  const servicio = await servicioRepository.obtenerPorId(id);

  if (!servicio) {
    throw new Error("Servicio no encontrado");
  }

  const empresa = await servicioRepository.obtenerEmpresaPorId(Number(data.empresa_id));

  if (!empresa) {
    throw new Error("Empresa no encontrada");
  }

  if (Number(empresa.usuario_id) !== Number(usuario_id)) {
    throw new Error("No autorizado");
  }

  const existente = await servicioRepository.obtenerPorEmpresaYNombre(
    Number(data.empresa_id),
    data.nombre
  );

  if (existente && Number(existente.id) !== Number(id)) {
    throw new Error("Ya existe un servicio con ese nombre en esta empresa");
  }

  return await servicioRepository.actualizar(id, {
    empresa_id: Number(data.empresa_id),
    nombre: data.nombre,
    descripcion: data.descripcion,
    precio: data.precio,
    foto: data.foto || "",
    disponible: data.disponible ?? true
  });
};
