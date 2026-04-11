const empresaService = require("../services/empresaService");

exports.crearEmpresa = async (req, res) => {
  try {
    const empresa = await empresaService.crearEmpresa(req.body, req.user.id);

    res.json({
      message: "Empresa registrada",
      empresa
    });
  } catch (error) {
    console.error("ERROR CREANDO EMPRESA:", error);

    if (error.message === "Ya existe una empresa con ese documento") {
      return res.status(400).json({ error: error.message });
    }

    if (error.message === "Ya existe una empresa con ese correo") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Error registrando empresa" });
  }
};

exports.getEmpresas = async (req, res) => {
  try {
    const empresas = await empresaService.obtenerEmpresasPorUsuario(req.user.id);
    res.json(empresas);
  } catch (error) {
    console.error("ERROR OBTENIENDO EMPRESAS:", error);
    res.status(500).json({ error: "Error obteniendo empresas" });
  }
};

exports.eliminarEmpresa = async (req, res) => {
  try {
    await empresaService.eliminarEmpresa(req.params.id, req.user.id);

    res.json({
      message: "Empresa eliminada"
    });
  } catch (error) {
    console.error("ERROR ELIMINANDO EMPRESA:", error);

    if (error.message === "Empresa no encontrada") {
      return res.status(404).json({ error: error.message });
    }

    if (error.message === "No autorizado") {
      return res.status(403).json({ error: error.message });
    }

    res.status(500).json({ error: "Error eliminando empresa" });
  }
};

exports.getEmpresasPorCategoria = async (req, res) => {
  try {
    const empresas = await empresaService.obtenerEmpresasPorCategoria(
      req.params.categoria
    );

    res.json(empresas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo empresas por categoría" });
  }
};

exports.getEmpresaDetalle = async (req, res) => {
  try {
    const empresa = await empresaService.obtenerDetalleEmpresa(req.params.id);

    if (!empresa) {
      return res.status(404).json({ error: "Empresa no encontrada" });
    }

    res.json(empresa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo detalle de empresa" });
  }
};

exports.actualizarEmpresa = async (req, res) => {
  try {
    const empresaActualizada = await empresaService.actualizarEmpresa(
      req.params.id,
      req.body,
      req.user.id
    );

    res.json({
      message: "Empresa actualizada correctamente",
      empresa: empresaActualizada
    });
  } catch (error) {
    console.error("ERROR ACTUALIZANDO EMPRESA:", error);

    if (error.message === "Empresa no encontrada") {
      return res.status(404).json({ error: error.message });
    }

    if (error.message === "No autorizado") {
      return res.status(403).json({ error: error.message });
    }

    if (error.message === "Ya existe una empresa con ese documento") {
      return res.status(400).json({ error: error.message });
    }

    if (error.message === "Ya existe una empresa con ese correo") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Error actualizando empresa" });
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