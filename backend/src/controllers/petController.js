const petService = require("../services/petService");

exports.createPet = async (req, res) => {
  try {
    const { user_id, nombre, tipo, raza, color, peso, edad, vacunas, foto } = req.body;

    const pet = await petService.crearMascota({
      user_id,
      nombre,
      tipo,
      raza,
      color,
      peso,
      edad,
      vacunas,
      foto
    });

    res.json({
      message: "Mascota registrada",
      pet
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registrando mascota" });
  }
};

exports.getPetsByUser = async (req, res) => {
  try {
    const pets = await petService.obtenerMascotasPorUsuario(req.params.id);
    res.json(pets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo mascotas" });
  }
};

exports.actualizarMascota = async (req, res) => {
  try {
    const pet = await petService.actualizarMascota(req.params.id, req.body);

    res.json({
      message: "Mascota actualizada",
      pet
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Mascota no encontrada") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Error actualizando mascota" });
  }
};

exports.eliminarMascota = async (req, res) => {
  try {
    const pet = await petService.eliminarMascota(req.params.id);

    res.json({
      message: "Mascota eliminada",
      pet
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Mascota no encontrada") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Error eliminando mascota" });
  }
};