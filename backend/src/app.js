const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/database");

const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
const empresaRoutes = require("./routes/empresaRoutes");
const servicioRoutes = require("./routes/servicioRoutes");
const citaRoutes = require("./routes/citaRoutes");
const historiaRoutes = require("./routes/historiaClinicaRoutes");


const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://petcare-jade.vercel.app",
  "https://petcare-5qvs83v0-joaquinhiguitalo-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS bloqueado para origen: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("PetCare API funcionando");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/debug-servicios", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, empresa_id, nombre, disponible FROM servicios ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/citas", citaRoutes);
app.use("/api/historias", historiaRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});