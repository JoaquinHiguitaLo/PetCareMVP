const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

const { 
    crearEmpresa, 
    getEmpresas, 
    eliminarEmpresa, 
    getEmpresasPorCategoria,
    getEmpresaDetalle,
    actualizarEmpresa
} = require("../controllers/empresaController");


router.get("/categoria/:categoria", getEmpresasPorCategoria);
router.post("/", verifyToken, crearEmpresa);
router.get("/", verifyToken, getEmpresas);
router.put("/:id", verifyToken, actualizarEmpresa);
router.delete("/:id", verifyToken, eliminarEmpresa);
router.get("/:id/detalle", getEmpresaDetalle);

module.exports = router;