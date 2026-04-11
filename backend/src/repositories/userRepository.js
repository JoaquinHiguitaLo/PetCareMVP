const pool = require("../config/database");

exports.obtenerPorEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
    [email]
  );

  return result.rows[0];
};

exports.obtenerPorCedula = async (cedula) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE cedula = $1",
    [cedula]
  );

  return result.rows[0];
};

exports.crear = async ({ nombre, cedula, email, telefono, passwordHash, rol }) => {
  const result = await pool.query(
    `INSERT INTO users (nombre, cedula, email, telefono, password, rol)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id, nombre, cedula, email, telefono, rol`,
    [nombre, cedula, email, telefono, passwordHash, rol]
  );

  return result.rows[0];
};