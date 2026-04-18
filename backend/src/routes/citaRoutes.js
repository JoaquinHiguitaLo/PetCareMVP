const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

const {
  crearCita,
  getCitasPorUsuario,
  cancelarCita,
  getCitasPorEmpresa,
  confirmarCita,
  completarCita,
  eliminarCita
} = require("../controllers/citaController");

router.post("/", verifyToken, crearCita);
router.get("/usuario/:usuario_id", verifyToken, getCitasPorUsuario);
router.get("/empresa/:empresa_id", verifyToken, getCitasPorEmpresa);
router.put("/:id/cancelar", verifyToken, cancelarCita);
router.put("/:id/confirmar", verifyToken, confirmarCita);
router.put("/:id/completar", verifyToken, completarCita);
router.delete("/:id", verifyToken, eliminarCita);

module.exports = router;