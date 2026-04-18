const citaService = require("../services/citaService");

exports.crearCita = async (req, res) => {
  try {
    const cita = await citaService.crearCita(req.body);

    res.json({
      message: "Cita registrada",
      cita
    });
  } catch (error) {
    console.error("ERROR CREANDO CITA:", error);

    if (
      error.message === "La cita no puede registrarse en una fecha pasada" ||
      error.message === "La mascota ya tiene una cita en esa fecha y hora" ||
      error.message === "La empresa ya tiene una cita agendada en esa fecha y hora"
    ) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message === "Servicio no encontrado") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Error creando cita" });
  }
};

exports.getCitasPorUsuario = async (req, res) => {
  try {
    const citas = await citaService.obtenerCitasPorUsuario(req.params.usuario_id);
    res.json(citas);
  } catch (error) {
    console.error("ERROR OBTENIENDO CITAS USUARIO:", error);
    res.status(500).json({ error: "Error obteniendo citas" });
  }
};

exports.getCitasPorEmpresa = async (req, res) => {
  try {
    const citas = await citaService.obtenerCitasPorEmpresa(req.params.empresa_id);
    res.json(citas);
  } catch (error) {
    console.error("ERROR OBTENIENDO CITAS EMPRESA:", error);
    res.status(500).json({ error: "Error obteniendo citas de empresa" });
  }
};

exports.cancelarCita = async (req, res) => {
  try {
    const cita = await citaService.cancelarCita(req.params.id);

    res.json({
      message: "Cita cancelada",
      cita
    });
  } catch (error) {
    console.error("ERROR CANCELANDO CITA:", error);

    if (error.message === "Cita no encontrada") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Error cancelando cita" });
  }
};

exports.confirmarCita = async (req, res) => {
  try {
    const cita = await citaService.confirmarCita(req.params.id);

    res.json({
      message: "Cita confirmada",
      cita
    });
  } catch (error) {
    console.error("ERROR CONFIRMANDO CITA:", error);

    if (error.message === "Cita no encontrada") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Error confirmando cita" });
  }
};

exports.completarCita = async (req, res) => {
  try {
    const cita = await citaService.completarCita(req.params.id);

    res.json({
      message: "Cita completada",
      cita
    });
  } catch (error) {
    console.error("ERROR COMPLETANDO CITA:", error);

    if (error.message === "Cita no encontrada") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Error completando cita" });
  }
};

exports.eliminarCita = async (req, res) => {
  try {
    const cita = await citaService.eliminarCita(req.params.id);

    res.json({
      message: "Cita eliminada",
      cita
    });
  } catch (error) {
    console.error("ERROR ELIMINANDO CITA:", error);

    if (
      error.message === "Cita no encontrada" ||
      error.message === "Solo se pueden eliminar citas canceladas"
    ) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Error eliminando cita" });
  }
};