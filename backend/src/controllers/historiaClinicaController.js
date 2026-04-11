const pool = require("../config/database");

exports.crearHistoria = async (req, res) => {
  try {
    const { mascota_id, diagnostico, tratamiento, observaciones } = req.body;

    const result = await pool.query(
      `INSERT INTO historias_clinicas
      (mascota_id, diagnostico, tratamiento, observaciones)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [mascota_id, diagnostico, tratamiento, observaciones]
    );

    res.json({
      message: "Historia clínica registrada",
      historia: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error registrando historia clínica"
    });
  }
};


exports.obtenerHistoriaPorMascota = async (req, res) => {
  try {
    const { mascota_id } = req.params;

    const result = await pool.query(
      `SELECT * FROM historias_clinicas
       WHERE mascota_id = $1
       ORDER BY fecha DESC`,
      [mascota_id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error obteniendo historia clínica"
    });
  }
};