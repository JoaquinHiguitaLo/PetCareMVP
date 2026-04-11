const citaRepository = require("../repositories/citaRepository");

exports.crearCita = async (data) => {
  const fechaCita = new Date(data.fecha);
  const ahora = new Date();

  if (fechaCita <= ahora) {
    throw new Error("La cita no puede registrarse en una fecha pasada");
  }

  const mascotaOcupada = await citaRepository.obtenerPorMascotaYFecha(
    data.mascota_id,
    data.fecha
  );

  if (mascotaOcupada) {
    throw new Error("La mascota ya tiene una cita en esa fecha y hora");
  }

  const servicio = await citaRepository.obtenerServicioPorId(data.servicio_id);

  if (!servicio) {
    throw new Error("Servicio no encontrado");
  }

  const empresaOcupada = await citaRepository.obtenerPorEmpresaYFecha(
    servicio.empresa_id,
    data.fecha
  );

  if (empresaOcupada) {
    throw new Error("La empresa ya tiene una cita agendada en esa fecha y hora");
  }

  return await citaRepository.crear({
    usuario_id: data.usuario_id,
    mascota_id: data.mascota_id,
    servicio_id: data.servicio_id,
    fecha: data.fecha
  });
};

exports.obtenerCitasPorUsuario = async (usuario_id) => {
  return await citaRepository.obtenerPorUsuario(usuario_id);
};

exports.obtenerCitasPorEmpresa = async (empresa_id) => {
  return await citaRepository.obtenerPorEmpresa(empresa_id);
};

exports.cancelarCita = async (id) => {
  const cita = await citaRepository.obtenerPorId(id);

  if (!cita) {
    throw new Error("Cita no encontrada");
  }

  return await citaRepository.cancelar(id);
};

exports.confirmarCita = async (id) => {
  const cita = await citaRepository.obtenerPorId(id);

  if (!cita) {
    throw new Error("Cita no encontrada");
  }

  return await citaRepository.confirmar(id);
};

exports.completarCita = async (id) => {
  const cita = await citaRepository.obtenerPorId(id);

  if (!cita) {
    throw new Error("Cita no encontrada");
  }

  return await citaRepository.completar(id);
};