import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { showConfirm, showError, showSuccess, showWarning } from "./utils/alerts";
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
        if (data.length > 0 && !empresaSeleccionada) {
          setEmpresaSeleccionada(String(data[0].id));
        }
      }
    } catch (error) {
      console.error(error);
      showError("Error", "No se pudieron cargar las empresas");
    }
  };

  const cargarCitas = async (empresaId) => {
    if (!empresaId) return;

    try {
      const res = await fetch(`${API_URL}/api/citas/empresa/${empresaId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setCitas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      showError("Error", "No se pudieron cargar las citas");
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
    const result = await showConfirm(
      "¿Confirmar cita?",
      "La cita cambiará a estado confirmada"
    );

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/api/citas/${id}/confirmar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        await showSuccess("Cita confirmada", "La cita fue confirmada correctamente");
        cargarCitas(empresaSeleccionada);
      } else {
        showError("Error", data.error || "Error confirmando cita");
      }
    } catch (error) {
      console.error(error);
      showError("Error", "Error conectando con el servidor");
    }
  };

  const cancelarCita = async (cita) => {
    const fechaCita = new Date(cita.fecha);
    const ahora = new Date();
    const diferenciaHoras = (fechaCita - ahora) / (1000 * 60 * 60);

    if (diferenciaHoras < 12) {
      showWarning(
        "No se puede cancelar",
        "La empresa no puede cancelar una cita con menos de 12 horas de anticipación."
      );
      return;
    }

    const result = await showConfirm(
      "¿Cancelar cita?",
      "La cita cambiará a estado cancelada"
    );

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/api/citas/${cita.id}/cancelar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        await showSuccess("Cita cancelada", "La cita fue cancelada correctamente");
        cargarCitas(empresaSeleccionada);
      } else {
        showError("Error", data.error || "Error cancelando cita");
      }
    } catch (error) {
      console.error(error);
      showError("Error", "Error conectando con el servidor");
    }
  };

  const completarCita = async (id) => {
    const result = await showConfirm(
      "¿Completar cita?",
      "La cita cambiará a estado completada"
    );

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/api/citas/${id}/completar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        await showSuccess("Cita completada", "La cita fue marcada como completada");
        cargarCitas(empresaSeleccionada);
      } else {
        showError("Error", data.error || "Error completando cita");
      }
    } catch (error) {
      console.error(error);
      showError("Error", "Error conectando con el servidor");
    }
  };

  const eliminarCita = async (id) => {
    const result = await showConfirm(
      "¿Eliminar cita?",
      "Esta acción eliminará la cita cancelada"
    );

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/api/citas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        await showSuccess("Cita eliminada", "La cita fue eliminada correctamente");
        cargarCitas(empresaSeleccionada);
      } else {
        showError("Error", data.error || "No se pudo eliminar");
      }
    } catch (error) {
      console.error(error);
      showError("Error", "Error conectando con el servidor");
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
                        onClick={() => cancelarCita(cita)}
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
                        onClick={() => cancelarCita(cita)}
                      >
                        Cancelar cita
                      </button>
                    </>
                  )}

                  {cita.estado === "cancelada" && (
                    <button
                      className="dashboard-button"
                      style={{ background: "#6b7280" }}
                      onClick={() => eliminarCita(cita.id)}
                    >
                      🗑️ Eliminar
                    </button>
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