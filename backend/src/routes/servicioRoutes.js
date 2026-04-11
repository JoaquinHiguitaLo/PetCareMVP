const express = require("express");
const router = express.Router();

const {
  crearServicio,
  getServiciosPorEmpresa,
  getTodosLosServicios,
  eliminarServicio,
  actualizarServicio
} = require("../controllers/servicioController");

const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, crearServicio);
router.get("/", getTodosLosServicios);
router.get("/empresa/:empresaId", getServiciosPorEmpresa);
router.delete("/:id", verifyToken, eliminarServicio);
router.put("/:id", verifyToken, actualizarServicio);

module.exports = router;