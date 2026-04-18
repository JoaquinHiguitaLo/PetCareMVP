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

exports.findByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
};


exports.guardarCodigoReset = async (email, codigo, expiracion) => {
  await pool.query(
    `
    UPDATE users
    SET reset_code = $1,
        reset_code_expires = $2
    WHERE email = $3
    `,
    [codigo, expiracion, email]
  );
};


exports.updatePassword = async (email, hashedPassword) => {
  await pool.query(
    `
    UPDATE users
    SET password = $1
    WHERE email = $2
    `,
    [hashedPassword, email]
  );
};


exports.limpiarCodigoReset = async (email) => {
  await pool.query(
    `
    UPDATE users
    SET reset_code = NULL,
        reset_code_expires = NULL
    WHERE email = $1
    `,
    [email]
  );
};