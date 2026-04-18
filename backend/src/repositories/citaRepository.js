const pool = require("../config/database");

exports.crear = async ({ usuario_id, mascota_id, servicio_id, fecha }) => {
  const result = await pool.query(
    `INSERT INTO citas (usuario_id, mascota_id, servicio_id, fecha, estado)
     VALUES ($1,$2,$3,$4,'pendiente')
     RETURNING *`,
    [usuario_id, mascota_id, servicio_id, fecha]
  );

  return result.rows[0];
};

exports.obtenerPorUsuario = async (usuario_id) => {
  const result = await pool.query(
    `SELECT 
        c.id,
        c.fecha,
        c.estado,
        p.nombre AS mascota,
        s.nombre AS servicio,
        e.nombre AS empresa
     FROM citas c
     JOIN pets p ON c.mascota_id = p.id
     JOIN servicios s ON c.servicio_id = s.id
     JOIN empresas e ON s.empresa_id = e.id
     WHERE c.usuario_id = $1
     ORDER BY c.fecha DESC`,
    [usuario_id]
  );

  return result.rows;
};

exports.obtenerPorEmpresa = async (empresa_id) => {
  const result = await pool.query(
    `SELECT 
        c.id,
        c.fecha,
        c.estado,
        u.nombre AS usuario,
        p.nombre AS mascota,
        s.nombre AS servicio
     FROM citas c
     JOIN users u ON c.usuario_id = u.id
     JOIN pets p ON c.mascota_id = p.id
     JOIN servicios s ON c.servicio_id = s.id
     WHERE s.empresa_id = $1
     ORDER BY c.fecha DESC`,
    [empresa_id]
  );

  return result.rows;
};

exports.obtenerPorMascotaYFecha = async (mascota_id, fecha) => {
  const result = await pool.query(
    "SELECT * FROM citas WHERE mascota_id = $1 AND fecha = $2",
    [mascota_id, fecha]
  );

  return result.rows[0];
};

exports.obtenerServicioPorId = async (servicio_id) => {
  const result = await pool.query(
    "SELECT * FROM servicios WHERE id = $1",
    [servicio_id]
  );

  return result.rows[0];
};

exports.obtenerPorEmpresaYFecha = async (empresa_id, fecha) => {
  const result = await pool.query(
    `SELECT c.*
     FROM citas c
     JOIN servicios s ON c.servicio_id = s.id
     WHERE s.empresa_id = $1 AND c.fecha = $2`,
    [empresa_id, fecha]
  );

  return result.rows[0];
};

exports.obtenerPorId = async (id) => {
  const result = await pool.query(
    `SELECT c.*, s.empresa_id
     FROM citas c
     JOIN servicios s ON c.servicio_id = s.id
     WHERE c.id = $1`,
    [id]
  );

  return result.rows[0];
};

exports.cancelar = async (id) => {
  const result = await pool.query(
    `UPDATE citas
     SET estado = 'cancelada'
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};

exports.confirmar = async (id) => {
  const result = await pool.query(
    `UPDATE citas
     SET estado = 'confirmada'
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};

exports.completar = async (id) => {
  const result = await pool.query(
    `UPDATE citas
     SET estado = 'completada'
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};

exports.eliminar = async (id) => {
  const result = await pool.query(
    "DELETE FROM citas WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};