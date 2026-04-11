const express = require("express");
const router = express.Router();


const { createPet, getPetsByUser, actualizarMascota, eliminarMascota } = require("../controllers/petController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/test-pets", (req, res) => {
  res.json({ message: "Pet routes funcionando" });
});

// PROTEGIDA
router.post("/", verifyToken, createPet);
router.get("/user/:id", getPetsByUser);
router.put("/:id", verifyToken, actualizarMascota);
router.delete("/:id", verifyToken, eliminarMascota);

module.exports = router;