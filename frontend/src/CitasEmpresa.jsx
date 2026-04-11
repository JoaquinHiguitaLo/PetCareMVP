import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import "./dashboard.css";

function CitasEmpresa() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [citas, setCitas] = useState([]);

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
        if (data.length > 0) {
          setEmpresaSeleccionada(String(data[0].id));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cargarCitas = async (empresaId) => {
    if (!empresaId) return;

    try {
      const res = await fetch(`${API_URL}/api/citas/empresa/${empresaId}`);
      const data = await res.json();
      setCitas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  useEffect(() => {
    if (empresaSeleccionada) {
      cargarCitas(empresaSeleccionada);
    }
  }, [empresaSeleccionada]);

  const confirmarCita = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/citas/${id}/confirmar`, {
        method: "PUT"
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cita confirmada ✅");
        cargarCitas(empresaSeleccionada);
      } else {
        alert(data.error || "Error confirmando cita");
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  const cancelarCita = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas cancelar esta cita?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/api/citas/${id}/cancelar`, {
        method: "PUT"
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cita cancelada correctamente");
        cargarCitas(empresaSeleccionada);
      } else {
        alert(data.error || "Error cancelando cita");
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  const completarCita = async (id) => {
    const confirmar = window.confirm("¿Marcar esta cita como completada?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/api/citas/${id}/completar`, {
        method: "PUT"
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cita completada correctamente");
        cargarCitas(empresaSeleccionada);
      } else {
        alert(data.error || "Error completando cita");
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  const colorEstado = (estado) => {
    if (estado === "pendiente") return "#f39c12";
    if (estado === "confirmada") return "#27ae60";
    if (estado === "cancelada") return "#e74c3c";
    if (estado === "completada") return "#3498db";
    return "#555";
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString();
  };

  return (
    <DashboardLayout title="📋 Citas recibidas">
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>🏥 Selecciona una empresa</h2>

          {empresas.length === 0 ? (
            <p>No tienes empresas registradas</p>
          ) : (
            <select
              className="dashboard-select"
              value={empresaSeleccionada}
              onChange={(e) => setEmpresaSeleccionada(e.target.value)}
            >
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="dashboard-card">
          <h2>📅 Agenda de citas</h2>

          {citas.length === 0 ? (
            <p>No hay citas para esta empresa</p>
          ) : (
            citas.map((cita) => (
              <div key={cita.id} className="dashboard-item">
                <p><strong>Servicio:</strong> {cita.servicio}</p>
                <p><strong>Usuario:</strong> {cita.usuario}</p>
                <p><strong>Mascota:</strong> {cita.mascota}</p>
                <p><strong>Fecha:</strong> {formatearFecha(cita.fecha)}</p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span style={{ color: colorEstado(cita.estado), fontWeight: "bold" }}>
                    {cita.estado}
                  </span>
                </p>

                <div className="dashboard-actions" style={{ marginTop: "10px" }}>
                  {cita.estado === "pendiente" && (
                    <>
                      <button
                        className="dashboard-button"
                        style={{ background: "#27ae60" }}
                        onClick={() => confirmarCita(cita.id)}
                      >
                        Confirmar cita
                      </button>

                      <button
                        className="dashboard-button"
                        style={{ background: "#e74c3c" }}
                        onClick={() => cancelarCita(cita.id)}
                      >
                        Cancelar cita
                      </button>
                    </>
                  )}

                  {cita.estado === "confirmada" && (
                    <>
                      <button
                        className="dashboard-button"
                        style={{ background: "#3498db" }}
                        onClick={() => completarCita(cita.id)}
                      >
                        Completar cita
                      </button>

                      <button
                        className="dashboard-button"
                        style={{ background: "#e74c3c" }}
                        onClick={() => cancelarCita(cita.id)}
                      >
                        Cancelar cita
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CitasEmpresa;