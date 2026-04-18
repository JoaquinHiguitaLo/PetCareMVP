import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { showConfirm, showError, showSuccess } from "./utils/alerts";
import "./dashboard.css";

function MisEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    nombre_propietario: "",
    documento: "",
    direccion: "",
    telefono: "",
    correo: "",
    descripcion: "",
    categoria: ""
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const cargarEmpresas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/empresas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setEmpresas(data);
      }
    } catch (error) {
      console.error(error);
      showError("Error", "No se pudieron cargar las empresas");
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: "",
      nombre_propietario: "",
      documento: "",
      direccion: "",
      telefono: "",
      correo: "",
      descripcion: "",
      categoria: ""
    });
  };

  const handleEditar = (empresa) => {
    setEditandoId(empresa.id);
    setForm({
      nombre: empresa.nombre || "",
      nombre_propietario: empresa.nombre_propietario || "",
      documento: empresa.documento || "",
      direccion: empresa.direccion || "",
      telefono: empresa.telefono || "",
      correo: empresa.correo || "",
      descripcion: empresa.descripcion || "",
      categoria: empresa.categoria || ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editandoId
        ? `${API_URL}/api/empresas/${editandoId}`
        : `${API_URL}/api/empresas`;

      const method = editandoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        await showSuccess(
          editandoId ? "Empresa actualizada" : "Empresa creada",
          editandoId
            ? "La empresa se actualizó correctamente"
            : "La empresa se registró correctamente"
        );

        limpiarFormulario();
        setEditandoId(null);
        cargarEmpresas();
      } else {
        showError("Error", data.error || "Error guardando empresa");
      }
    } catch (error) {
      console.error(error);
      showError("Error", "Error conectando con el servidor");
    }
  };

  const handleEliminar = async (id) => {
    const result = await showConfirm(
      "¿Eliminar empresa?",
      "Esta acción no se puede deshacer"
    );

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/api/empresas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        await showSuccess(
          "Empresa eliminada",
          "La empresa se eliminó correctamente"
        );
        cargarEmpresas();
      } else {
        showError("Error", data.error || "Error eliminando empresa");
      }
    } catch (error) {
      console.error(error);
      showError("Error", "Error conectando con el servidor");
    }
  };

  return (
    <DashboardLayout title="🏢 Mis empresas">
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>{editandoId ? "✏️ Editar empresa" : "➕ Registrar empresa"}</h2>

          <form onSubmit={handleSubmit}>
            <input
              className="dashboard-input"
              name="nombre"
              placeholder="Nombre empresa"
              value={form.nombre}
              onChange={handleChange}
            />

            <input
              className="dashboard-input"
              name="nombre_propietario"
              placeholder="Nombre propietario"
              value={form.nombre_propietario}
              onChange={handleChange}
            />

            <input
              className="dashboard-input"
              name="documento"
              placeholder="Documento"
              value={form.documento}
              onChange={handleChange}
            />

            <input
              className="dashboard-input"
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
            />

            <input
              className="dashboard-input"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
            />

            <input
              className="dashboard-input"
              name="correo"
              placeholder="Correo"
              value={form.correo}
              onChange={handleChange}
            />

            <textarea
              className="dashboard-textarea"
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
            />

            <select
              className="dashboard-input"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="Veterinarias">Veterinarias</option>
              <option value="Spas">Spas</option>
              <option value="Tiendas">Tiendas</option>
              <option value="Guarderías">Guarderías</option>
              <option value="Entrenadores">Entrenadores</option>
              <option value="Funerarias">Funerarias</option>
            </select>

            <button type="submit" className="dashboard-button">
              {editandoId ? "Actualizar empresa" : "Guardar empresa"}
            </button>

            {editandoId && (
              <button
                type="button"
                className="dashboard-button"
                style={{ background: "#6b7280", marginTop: "10px" }}
                onClick={() => {
                  setEditandoId(null);
                  limpiarFormulario();
                }}
              >
                Cancelar edición
              </button>
            )}
          </form>
        </div>

        <div className="dashboard-card">
          <h2>📋 Empresas registradas</h2>

          {empresas.length === 0 ? (
            <p>No tienes empresas registradas</p>
          ) : (
            empresas.map((empresa) => (
              <div key={empresa.id} className="dashboard-item">
                <p><strong>Nombre:</strong> {empresa.nombre}</p>
                <p><strong>Propietario:</strong> {empresa.nombre_propietario}</p>
                <p><strong>Dirección:</strong> {empresa.direccion}</p>
                <p><strong>Teléfono:</strong> {empresa.telefono}</p>
                <p><strong>Correo:</strong> {empresa.correo}</p>
                <p><strong>Categoría:</strong> {empresa.categoria}</p>
                <p><strong>Estado:</strong> {empresa.verificado ? "✅ Verificado" : "⏳ Pendiente"}</p>

                <div className="dashboard-actions" style={{ marginTop: "10px" }}>
                  <button
                    className="dashboard-button"
                    style={{ background: "#f39c12" }}
                    onClick={() => handleEditar(empresa)}
                  >
                    Editar
                  </button>
                  <button
                    className="dashboard-button"
                    style={{ background: "#e74c3c" }}
                    onClick={() => handleEliminar(empresa.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MisEmpresas;