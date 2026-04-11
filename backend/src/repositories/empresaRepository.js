const pool = require("../config/database");

exports.crear = async ({
  usuario_id,
  nombre,
  nombre_propietario,
  documento,
  direccion,
  telefono,
  correo,
  descripcion
}) => {
  const result = await pool.query(
    `INSERT INTO empresas
     (usuario_id, nombre, nombre_propietario, documento, direccion, telefono, correo, descripcion)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [usuario_id, nombre, nombre_propietario, documento, direccion, telefono, correo, descripcion]
  );

  return result.rows[0];
};

exports.obtenerPorUsuario = async (usuario_id) => {
  const result = await pool.query(
    "SELECT * FROM empresas WHERE usuario_id = $1 ORDER BY id DESC",
    [usuario_id]
  );

  return result.rows;
};

exports.obtenerPorId = async (id) => {
  const result = await pool.query(
    "SELECT * FROM empresas WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

exports.eliminar = async (id) => {
  await pool.query("DELETE FROM empresas WHERE id = $1", [id]);
};

exports.obtenerPorDocumento = async (documento) => {
  const result = await pool.query(
    "SELECT * FROM empresas WHERE documento = $1",
    [documento]
  );

  return result.rows[0];
};

exports.obtenerPorCorreo = async (correo) => {
  const result = await pool.query(
    "SELECT * FROM empresas WHERE LOWER(correo) = LOWER($1)",
    [correo]
  );

  return result.rows[0];
};

exports.obtenerPorCategoria = async (categoria) => {
  const result = await pool.query(
    `SELECT 
      id,
      nombre,
      descripcion,
      direccion,
      telefono,
      correo,
      categoria,
      imagen,
      rating,
      promocion,
      distancia_km,
      tags
     FROM empresas
     WHERE LOWER(categoria) = LOWER($1)
     ORDER BY rating DESC, nombre ASC`,
    [categoria]
  );

  return result.rows;
};

exports.obtenerDetallePorId = async (id) => {
  const result = await pool.query(
    `SELECT 
      id,
      nombre,
      descripcion,
      direccion,
      telefono,
      correo,
      categoria,
      imagen,
      rating,
      promocion,
      distancia_km,
      tags,
      horario,
      resenas
     FROM empresas
     WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

exports.actualizar = async (id, data) => {
  const result = await pool.query(
    `UPDATE empresas
     SET nombre = $1,
         nombre_propietario = $2,
         documento = $3,
         direccion = $4,
         telefono = $5,
         correo = $6,
         descripcion = $7
     WHERE id = $8
     RETURNING *`,
    [
      data.nombre,
      data.nombre_propietario,
      data.documento,
      data.direccion,
      data.telefono,
      data.correo,
      data.descripcion,
      id
    ]
  );

  return result.rows[0];
};