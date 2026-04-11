import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import "./dashboard.css";

function MisCitas() {
  const [pets, setPets] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [citas, setCitas] = useState([]);
  const [form, setForm] = useState({
    mascota_id: "",
    servicio_id: "",
    fecha: ""
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;

  const cargarMascotas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pets/user/${user.id}`);
      const data = await res.json();
      setPets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarServicios = async () => {
    try {
      const res = await fetch(`${API_URL}/api/servicios`);
      const data = await res.json();
      setServicios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarCitas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/citas/usuario/${user.id}`);
      const data = await res.json();
      setCitas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      cargarMascotas();
      cargarServicios();
      cargarCitas();
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/citas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario_id: user.id,
          mascota_id: Number(form.mascota_id),
          servicio_id: Number(form.servicio_id),
          fecha: form.fecha
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cita registrada correctamente 📅");
        setForm({
          mascota_id: "",
          servicio_id: "",
          fecha: ""
        });
        cargarCitas();
      } else {
        alert(data.error || "Error creando cita");
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  const cancelarCita = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/citas/${id}/cancelar`, {
        method: "PUT"
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cita cancelada");
        cargarCitas();
      } else {
        alert(data.error || "Error cancelando cita");
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString();
  };

  const colorEstado = (estado) => {
    if (estado === "pendiente") return "#f39c12";
    if (estado === "cancelada") return "#e74c3c";
    if (estado === "confirmada") return "#27ae60";
    return "#555";
  };

  


  return (
    <DashboardLayout title="📅 Mis citas">
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>➕ Agendar cita</h2>

          <form onSubmit={handleSubmit}>
            <select
              name="mascota_id"
              value={form.mascota_id}
              onChange={handleChange}
              className="dashboard-select"
            >
              <option value="">Selecciona una mascota</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.nombre}
                </option>
              ))}
            </select>

            <select
              name="servicio_id"
              value={form.servicio_id}
              onChange={handleChange}
              className="dashboard-select"
            >
              <option value="">Selecciona un servicio</option>
              {servicios.map((servicio) => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre} - {servicio.empresa_nombre}
                </option>
              ))}
            </select>

            <input
              type="datetime-local"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="dashboard-input"
            />

            <button type="submit" className="dashboard-button">
              Guardar cita
            </button>
          </form>
        </div>

        <div className="dashboard-card">
          <h2>📋 Citas registradas</h2>

          {citas.length === 0 ? (
            <p>No tienes citas registradas</p>
          ) : (
            citas.map((cita) => (
              <div key={cita.id} className="dashboard-item">
                <p><strong>Servicio:</strong> {cita.servicio}</p>
                <p><strong>Mascota:</strong> {cita.mascota}</p>
                <p><strong>Empresa:</strong> {cita.empresa}</p>
                <p><strong>Fecha:</strong> {formatearFecha(cita.fecha)}</p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span style={{ color: colorEstado(cita.estado), fontWeight: "bold" }}>
                    {cita.estado}
                  </span>
                </p>

                {cita.estado !== "cancelada" && (
                  <button
                    className="dashboard-button"
                    style={{ background: "#e74c3c", marginTop: "10px" }}
                    onClick={() => cancelarCita(cita.id)}
                  >
                    Cancelar cita
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MisCitas;