const pool = require("../config/database");

exports.crear = async ({ empresa_id, nombre, descripcion, precio, foto, disponible }) => {
  const result = await pool.query(
    `INSERT INTO servicios (empresa_id, nombre, descripcion, precio, foto, disponible)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [empresa_id, nombre, descripcion, precio, foto, disponible]
  );

  return result.rows[0];
};

exports.obtenerPorEmpresa = async (empresaId) => {
  const result = await pool.query(
    "SELECT * FROM servicios WHERE empresa_id = $1 ORDER BY id DESC",
    [empresaId]
  );

  return result.rows;
};

exports.obtenerTodos = async () => {
  const result = await pool.query(`
    SELECT 
      s.*,
      e.nombre AS empresa_nombre,
      e.categoria
    FROM servicios s
    JOIN empresas e ON s.empresa_id = e.id
    WHERE s.disponible = true
    ORDER BY s.id DESC
  `);

  return result.rows;
};

exports.obtenerPorId = async (id) => {
  const result = await pool.query(
    "SELECT * FROM servicios WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

exports.eliminar = async (id) => {
  const result = await pool.query(
    "DELETE FROM servicios WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};

exports.obtenerEmpresaPorId = async (empresa_id) => {
  const result = await pool.query(
    "SELECT * FROM empresas WHERE id = $1",
    [empresa_id]
  );

  return result.rows[0];
};

exports.obtenerPorEmpresaYNombre = async (empresaId, nombre) => {
  const result = await pool.query(
    "SELECT * FROM servicios WHERE empresa_id = $1 AND LOWER(nombre) = LOWER($2)",
    [empresaId, nombre]
  );

  return result.rows[0];
};

exports.obtenerServiciosPorEmpresa = async (empresaId) => {
  const result = await pool.query(
    `SELECT 
        id,
        empresa_id,
        nombre,
        descripcion,
        precio,
        disponible,
        foto,
        duracion_min,
        imagen
     FROM servicios
     WHERE empresa_id = $1
     ORDER BY nombre ASC`,
    [empresaId]
  );

  console.log("REPOSITORY rows:", result.rows);
  return result.rows;
};




exports.actualizar = async (id, { empresa_id, nombre, descripcion, precio, foto, disponible }) => {
  const result = await pool.query(
    `UPDATE servicios
     SET empresa_id = $1,
         nombre = $2,
         descripcion = $3,
         precio = $4,
         foto = $5,
         disponible = $6
     WHERE id = $7
     RETURNING *`,
    [empresa_id, nombre, descripcion, precio, foto, disponible, id]
  );

  return result.rows[0];
};