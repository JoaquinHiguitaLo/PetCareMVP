const pool = require("../config/database");

exports.crear = async ({ user_id, nombre, tipo, raza, color, peso, edad, vacunas, foto }) => {
  const result = await pool.query(
    `INSERT INTO pets (user_id, nombre, tipo, raza, color, peso, edad, vacunas, foto)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [user_id, nombre, tipo, raza, color, peso, edad, vacunas, foto]
  );

  return result.rows[0];
};

exports.obtenerPorUsuario = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM pets WHERE user_id = $1 ORDER BY id DESC",
    [userId]
  );

  return result.rows;
};

exports.obtenerPorId = async (id) => {
  const result = await pool.query(
    "SELECT * FROM pets WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

exports.actualizar = async (id, { nombre, tipo, raza, color, peso, edad, vacunas, foto }) => {
  const result = await pool.query(
    `UPDATE pets
     SET nombre = $1,
         tipo = $2,
         raza = $3,
         color = $4,
         peso = $5,
         edad = $6,
         vacunas = $7,
         foto = $8
     WHERE id = $9
     RETURNING *`,
    [nombre, tipo, raza, color, peso, edad, vacunas, foto, id]
  );

  return result.rows[0];
};

exports.eliminar = async (id) => {
  const result = await pool.query(
    "DELETE FROM pets WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};