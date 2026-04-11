import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import "./dashboard.css";

function MisMascotas() {
  const [pets, setPets] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    raza: "",
    color: "",
    peso: "",
    edad: "",
    vacunas: "",
    foto: ""
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;

  const cargarMascotas = async () => {
    if (!user) return;

    try {
      const res = await fetch(`${API_URL}/api/pets/user/${user.id}`);
      const data = await res.json();
      setPets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarMascotas();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleEditar = (pet) => {
    setEditandoId(pet.id);
    setForm({
      nombre: pet.nombre || "",
      raza: pet.raza || "",
      color: pet.color || "",
      peso: pet.peso || "",
      edad: pet.edad || "",
      vacunas: pet.vacunas || "",
      foto: pet.foto || ""
    });
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta mascota?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/api/pets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        alert("Mascota eliminada correctamente");
        if (editandoId === id) {
          limpiarFormulario();
        }
        cargarMascotas();
      } else {
        alert(data.error || "Error eliminando mascota");
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setForm({
      nombre: "",
      raza: "",
      color: "",
      peso: "",
      edad: "",
      vacunas: "",
      foto: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editandoId
        ? `${API_URL}/api/pets/${editandoId}`
        : `${API_URL}/api/pets`;

      const method = editandoId ? "PUT" : "POST";

      const bodyData = editandoId
        ? {
          nombre: form.nombre,
          raza: form.raza,
          color: form.color,
          peso: Number(form.peso),
          edad: Number(form.edad),
          vacunas: form.vacunas,
          foto: form.foto
        }
        : {
          user_id: user.id,
          nombre: form.nombre,
          raza: form.raza,
          color: form.color,
          peso: Number(form.peso),
          edad: Number(form.edad),
          vacunas: form.vacunas,
          foto: form.foto
        };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();

      if (res.ok) {
        alert(editandoId ? "Mascota actualizada correctamente 🐾" : "Mascota registrada correctamente 🐶");
        limpiarFormulario();
        cargarMascotas();
      } else {
        alert(data.error || "Error guardando mascota");
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  return (
    <DashboardLayout title="🐶 Mis mascotas">
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>{editandoId ? "✏️ Editar mascota" : "➕ Registrar mascota"}</h2>

          <form onSubmit={handleSubmit}>
            <input
              className="dashboard-input"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
            />

            <input
              className="dashboard-input"
              name="raza"
              placeholder="Raza"
              value={form.raza}
              onChange={handleChange}
            />

            <input
              className="dashboard-input"
              name="color"
              placeholder="Color"
              value={form.color}
              onChange={handleChange}
            />

            <input
              className="dashboard-input"
              name="peso"
              type="number"
              placeholder="Peso"
              value={form.peso}
              onChange={handleChange}
            />

            <input
              className="dashboard-input"
              name="edad"
              type="number"
              placeholder="Edad"
              value={form.edad}
              onChange={handleChange}
            />

            <input
              className="dashboard-input"
              name="vacunas"
              placeholder="Vacunas"
              value={form.vacunas}
              onChange={handleChange}
            />

            <input
              className="dashboard-input"
              name="foto"
              placeholder="URL de foto (opcional)"
              value={form.foto}
              onChange={handleChange}
            />

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button type="submit" className="dashboard-button">
                {editandoId ? "Actualizar mascota" : "Guardar mascota"}
              </button>

              {editandoId && (
                <button
                  type="button"
                  className="dashboard-button"
                  style={{ background: "#888" }}
                  onClick={limpiarFormulario}
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="dashboard-card">
          <h2>📋 Mascotas registradas</h2>

          {pets.length === 0 ? (
            <p>No tienes mascotas registradas</p>
          ) : (
            pets.map((pet) => (
              <div key={pet.id} className="dashboard-item">
                <p><strong>Nombre:</strong> {pet.nombre}</p>
                <p><strong>Raza:</strong> {pet.raza}</p>
                <p><strong>Color:</strong> {pet.color}</p>
                <p><strong>Peso:</strong> {pet.peso}</p>
                <p><strong>Edad:</strong> {pet.edad}</p>
                <p><strong>Vacunas:</strong> {pet.vacunas}</p>

                <div className="dashboard-actions" style={{ marginTop: "10px" }}>
                  <button
                    className="dashboard-button"
                    onClick={() => handleEditar(pet)}
                  >
                    Editar
                  </button>

                  <button
                    className="dashboard-button"
                    style={{ background: "#e74c3c" }}
                    onClick={() => handleEliminar(pet.id)}
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

export default MisMascotas;