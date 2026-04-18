const express = require("express");
const router = express.Router();

const {
  crearCita,
  getCitasPorUsuario,
  cancelarCita,
  getCitasPorEmpresa,
  confirmarCita,
  completarCita,
  eliminarCita
} = require("../controllers/citaController");

router.post("/", crearCita);
router.get("/usuario/:usuario_id", getCitasPorUsuario);
router.get("/empresa/:empresa_id", getCitasPorEmpresa);
router.put("/:id/cancelar", cancelarCita);
router.put("/:id/confirmar", confirmarCita);
router.put("/:id/completar", completarCita);
router.delete("/:id", eliminarCita);

module.exports = router;