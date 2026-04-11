const servicioService = require("../services/servicioService");

exports.crearServicio = async (req, res) => {
  try {
    const servicio = await servicioService.crearServicio(req.body, req.user.id);

    res.json({
      message: "Servicio registrado",
      servicio
    });
  } catch (error) {
    console.error("ERROR CREANDO SERVICIO:", error);

    if (error.message === "Empresa no encontrada") {
      return res.status(404).json({ error: error.message });
    }

    if (error.message === "No autorizado") {
      return res.status(403).json({ error: error.message });
    }

    if (error.message === "Ya existe un servicio con ese nombre en esta empresa") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Error registrando servicio" });
  }
};

exports.getServiciosPorEmpresa = async (req, res) => {
  try {
    console.log("CONTROLLER params:", req.params);

    const servicios = await servicioService.obtenerServiciosPorEmpresa(
      req.params.empresaId
    );

    console.log("CONTROLLER servicios:", servicios);

    res.json(servicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error obteniendo servicios de la empresa",
    });
  }
};


exports.getTodosLosServicios = async (req, res) => {
  try {
    const servicios = await servicioService.obtenerTodosLosServicios();
    res.json(servicios);
  } catch (error) {
    console.error("ERROR OBTENIENDO TODOS LOS SERVICIOS:", error);
    res.status(500).json({ error: "Error obteniendo todos los servicios" });
  }
};

exports.eliminarServicio = async (req, res) => {
  try {
    const servicio = await servicioService.eliminarServicio(req.params.id, req.user.id);

    res.json({
      message: "Servicio eliminado",
      servicio
    });
  } catch (error) {
    console.error("ERROR ELIMINANDO SERVICIO:", error);

    if (error.message === "Servicio no encontrado") {
      return res.status(404).json({ error: error.message });
    }

    if (error.message === "No autorizado") {
      return res.status(403).json({ error: error.message });
    }

    res.status(500).json({ error: "Error eliminando servicio" });
  }
};

exports.actualizarServicio = async (req, res) => {
  try {
    const servicioActualizado = await servicioService.actualizarServicio(
      req.params.id,
      req.body,
      req.user.id
    );

    res.json({
      message: "Servicio actualizado correctamente",
      servicio: servicioActualizado
    });
  } catch (error) {
    console.error("ERROR ACTUALIZANDO SERVICIO:", error);

    if (error.message === "Servicio no encontrado") {
      return res.status(404).json({ error: error.message });
    }

    if (error.message === "Empresa no encontrada") {
      return res.status(404).json({ error: error.message });
    }

    if (error.message === "No autorizado") {
      return res.status(403).json({ error: error.message });
    }

    if (error.message === "Ya existe un servicio con ese nombre en esta empresa") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Error actualizando servicio" });
  }
};