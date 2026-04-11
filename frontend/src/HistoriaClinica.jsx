import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import "./dashboard.css";

function HistoriaClinica() {
  const [pets, setPets] = useState([]);
  const [petSeleccionada, setPetSeleccionada] = useState("");
  const [historias, setHistorias] = useState([]);
  const [form, setForm] = useState({
    diagnostico: "",
    tratamiento: "",
    observaciones: ""
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

      if (Array.isArray(data)) {
        setPets(data);
        if (data.length > 0) {
          setPetSeleccionada(String(data[0].id));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cargarHistorias = async (petId) => {
    if (!petId) return;

    try {
      const res = await fetch(`${API_URL}/api/historias/mascota/${petId}`);
      const data = await res.json();
      setHistorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      cargarMascotas();
    }
  }, []);

  useEffect(() => {
    if (petSeleccionada) {
      cargarHistorias(petSeleccionada);
    }
  }, [petSeleccionada]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/historias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mascota_id: Number(petSeleccionada),
          diagnostico: form.diagnostico,
          tratamiento: form.tratamiento,
          observaciones: form.observaciones
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Historia clínica registrada 🩺");
        setForm({
          diagnostico: "",
          tratamiento: "",
          observaciones: ""
        });
        cargarHistorias(petSeleccionada);
      } else {
        alert(data.error || "Error registrando historia clínica");
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  return (
    <DashboardLayout title="🩺 Historia clínica">
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>➕ Registrar historia</h2>

          <select
            className="dashboard-select"
            value={petSeleccionada}
            onChange={(e) => setPetSeleccionada(e.target.value)}
          >
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.nombre}
              </option>
            ))}
          </select>

          <form onSubmit={handleSubmit}>
            <textarea
              className="dashboard-textarea"
              name="diagnostico"
              placeholder="Diagnóstico"
              value={form.diagnostico}
              onChange={handleChange}
            />

            <textarea
              className="dashboard-textarea"
              name="tratamiento"
              placeholder="Tratamiento"
              value={form.tratamiento}
              onChange={handleChange}
            />

            <textarea
              className="dashboard-textarea"
              name="observaciones"
              placeholder="Observaciones"
              value={form.observaciones}
              onChange={handleChange}
            />

            <button type="submit" className="dashboard-button">
              Guardar historia
            </button>
          </form>
        </div>

        <div className="dashboard-card">
          <h2>📋 Registros clínicos</h2>

          {historias.length === 0 ? (
            <p>No hay registros clínicos para esta mascota</p>
          ) : (
            historias.map((historia) => (
              <div key={historia.id} className="dashboard-item">
                <p><strong>Diagnóstico:</strong> {historia.diagnostico}</p>
                <p><strong>Tratamiento:</strong> {historia.tratamiento}</p>
                <p><strong>Observaciones:</strong> {historia.observaciones}</p>
                <p><strong>Fecha:</strong> {new Date(historia.fecha).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default HistoriaClinica;