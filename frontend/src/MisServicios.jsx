import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import "./dashboard.css";

function MisServicios() {
  const [empresas, setEmpresas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [form, setForm] = useState({
    empresa_id: "",
    nombre: "",
    descripcion: "",
    precio: "",
    foto: "",
    disponible: true
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
        if (data.length > 0 && !empresaSeleccionada) {
          setEmpresaSeleccionada(String(data[0].id));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cargarServicios = async (empresaId) => {
    if (!empresaId) return;

    try {
      const res = await fetch(`${API_URL}/api/servicios/empresa/${empresaId}`);
      const data = await res.json();
      setServicios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  useEffect(() => {
    if (empresaSeleccionada) {
      cargarServicios(empresaSeleccionada);
    }
  }, [empresaSeleccionada]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleEditar = (servicio) => {
    setEditandoId(servicio.id);
    setEmpresaSeleccionada(String(servicio.empresa_id || empresaSeleccionada));

    setForm({
      empresa_id: servicio.empresa_id || empresaSeleccionada,
      nombre: servicio.nombre || "",
      descripcion: servicio.descripcion || "",
      precio: servicio.precio || "",
      foto: servicio.foto || "",
      disponible: servicio.disponible ?? true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editandoId
        ? `${API_URL}/api/servicios/${editandoId}`
        : `${API_URL}/api/servicios`;

      const method = editandoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          empresa_id: Number(editandoId ? form.empresa_id : empresaSeleccionada),
          precio: Number(form.precio)
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          editandoId
            ? "Servicio actualizado correctamente"
            : "Servicio creado correctamente"
        );

        setForm({
          empresa_id: empresaSeleccionada || "",
          nombre: "",
          descripcion: "",
          precio: "",
          foto: "",
          disponible: true
        });

        setEditandoId(null);
        cargarServicios(empresaSeleccionada);
      } else {
        alert(data.error || "Error guardando servicio");
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este servicio?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/api/servicios/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        alert("Servicio eliminado correctamente");
        cargarServicios(empresaSeleccionada);
      } else {
        alert(data.error || "Error eliminando servicio");
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  return (
    <DashboardLayout title="💼 Mis servicios">
      {empresas.length === 0 ? (
        <div className="dashboard-card">
          <h2>No tienes empresas registradas</h2>
          <p>Primero crea una empresa para poder publicar servicios.</p>
          <button
            className="dashboard-button"
            onClick={() => (window.location.href = "/dashboard/empresas")}
          >
            Ir a Mis empresas
          </button>
        </div>
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>{editandoId ? "✏️ Editar servicio" : "➕ Registrar servicio"}</h2>

            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Empresa
            </label>

            <select
              value={empresaSeleccionada}
              onChange={(e) => setEmpresaSeleccionada(e.target.value)}
              className="dashboard-select"
            >
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nombre}
                </option>
              ))}
            </select>

            <form onSubmit={handleSubmit}>
              <input
                className="dashboard-input"
                name="nombre"
                placeholder="Nombre del servicio"
                value={form.nombre}
                onChange={handleChange}
              />

              <textarea
                className="dashboard-textarea"
                name="descripcion"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={handleChange}
              />

              <input
                className="dashboard-input"
                name="precio"
                type="number"
                placeholder="Precio"
                value={form.precio}
                onChange={handleChange}
              />

              <input
                className="dashboard-input"
                name="foto"
                placeholder="URL de la foto (opcional)"
                value={form.foto}
                onChange={handleChange}
              />

              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
                <input
                  type="checkbox"
                  name="disponible"
                  checked={form.disponible}
                  onChange={handleChange}
                />
                Disponible
              </label>

              <button type="submit" className="dashboard-button">
                {editandoId ? "Actualizar servicio" : "Guardar servicio"}
              </button>

              {editandoId && (
                <button
                  type="button"
                  className="dashboard-button"
                  style={{ background: "#6b7280", marginTop: "10px" }}
                  onClick={() => {
                    setEditandoId(null);
                    setForm({
                      empresa_id: "",
                      nombre: "",
                      descripcion: "",
                      precio: "",
                      foto: "",
                      disponible: true
                    });
                  }}
                >
                  Cancelar edición
                </button>
              )}
            </form>
          </div>

          <div className="dashboard-card">
            <h2>📋 Servicios de la empresa</h2>

            {servicios.length === 0 ? (
              <p>No hay servicios registrados para esta empresa.</p>
            ) : (
              servicios.map((servicio) => (
                <div key={servicio.id} className="dashboard-item">
                  <p><strong>Nombre:</strong> {servicio.nombre}</p>
                  <p><strong>Descripción:</strong> {servicio.descripcion}</p>
                  <p><strong>Precio:</strong> ${servicio.precio}</p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    {servicio.disponible ? "✅ Disponible" : "❌ No disponible"}
                  </p>

                  <div className="dashboard-actions" style={{ marginTop: "10px" }}>
                    <button
                      className="dashboard-button"
                      style={{ background: "#f39c12" }}
                      onClick={() => handleEditar(servicio)}
                    >
                      Editar
                    </button>
                    <button
                      className="dashboard-button"
                      style={{ background: "#e74c3c" }}
                      onClick={() => handleEliminar(servicio.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default MisServicios;