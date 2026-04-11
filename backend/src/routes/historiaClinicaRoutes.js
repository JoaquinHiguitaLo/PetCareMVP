const express = require("express");
const router = express.Router();

const {
  crearHistoria,
  obtenerHistoriaPorMascota
} = require("../controllers/historiaClinicaController");

router.post("/", crearHistoria);

router.get("/mascota/:mascota_id", obtenerHistoriaPorMascota);

module.exports = router;