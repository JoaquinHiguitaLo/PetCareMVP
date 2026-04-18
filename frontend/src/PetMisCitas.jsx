import { useEffect, useState } from "react";
import PetOwnerLayout from "./components/PetOwnerLayout";
import LoadingModal from "./components/LoadingModal";
import { showConfirm, showError, showSuccess, showWarning } from "./utils/alerts";
import "./petOwner.css";

function PetMisCitas() {
  const API_URL = import.meta.env.VITE_API_URL;

  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [citas, setCitas] = useState([]);

  const cargarCitas = async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/citas/usuario/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setCitas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      showError("Error", "No se pudieron cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const cancelarCita = async (cita) => {
    const fechaCita = new Date(cita.fecha);
    const ahora = new Date();
    const diferenciaHoras = (fechaCita - ahora) / (1000 * 60 * 60);

    if (diferenciaHoras < 3) {
      showWarning(
        "No disponible",
        "No puedes cancelar una cita con menos de 3 horas de anticipación."
      );
      return;
    }

    const result = await showConfirm(
      "¿Cancelar cita?",
      "La cita pasará al estado cancelada."
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
        setCitas((prev) =>
          prev.map((item) =>
            item.id === cita.id ? { ...item, estado: "cancelada" } : item
          )
        );

        await showSuccess("Cita cancelada", "La cita se canceló correctamente");
      } else {
        showError("Error", data.error || "No se pudo cancelar la cita");
      }
    } catch (error) {
      console.error(error);
      showError("Error", "Error conectando con el servidor");
    }
  };

  const eliminarCita = async (id) => {
    const result = await showConfirm(
      "¿Eliminar cita?",
      "Esta acción eliminará la cita cancelada."
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
        setCitas((prev) => prev.filter((cita) => cita.id !== id));
        await showSuccess("Cita eliminada", "La cita se eliminó correctamente");
      } else {
        showError("Error", data.error || "No se pudo eliminar la cita");
      }
    } catch (error) {
      console.error(error);
      showError("Error", "Error conectando con el servidor");
    }
  };

  return (
    <>
      {loading && <LoadingModal text="Cargando citas..." />}

      <PetOwnerLayout
        title="Mis Citas"
        subtitle="Aquí verás tus citas agendadas"
      >
        <div className="pet-card">
          {citas.length === 0 ? (
            <>
              <h2>No tienes citas agendadas</h2>
              <p>Agenda una cita desde los servicios de una empresa.</p>
            </>
          ) : (
            citas.map((cita) => (
              <div key={cita.id} className="pet-cita-item">
                <h3>{cita.servicio}</h3>

                <p>📅 {new Date(cita.fecha).toLocaleDateString()}</p>

                <p>
                  ⏰{" "}
                  {new Date(cita.fecha).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>

                <p>🐾 {cita.mascota}</p>
                <p>🏥 {cita.empresa}</p>

                <p
                  className="pet-cita-status"
                  style={{
                    color:
                      cita.estado === "pendiente"
                        ? "#f39c12"
                        : cita.estado === "confirmada"
                        ? "#27ae60"
                        : cita.estado === "cancelada"
                        ? "#e74c3c"
                        : "#3498db",
                    fontWeight: "bold"
                  }}
                >
                  Estado: {cita.estado}
                </p>

                {cita.estado === "pendiente" && (
                  <button
                    className="pet-cita-cancel-button"
                    onClick={() => cancelarCita(cita)}
                  >
                    Cancelar cita
                  </button>
                )}

                {cita.estado === "cancelada" && (
                  <button
                    className="pet-cita-delete-button"
                    onClick={() => eliminarCita(cita.id)}
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </PetOwnerLayout>
    </>
  );
}

export default PetMisCitas;