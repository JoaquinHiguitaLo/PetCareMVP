import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PetOwnerLayout from "./components/PetOwnerLayout";
import "./petOwner.css";

function PetMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [mascotaAbierta, setMascotaAbierta] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;

  const cargarMascotas = async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/pets/user/${user.id}`);
      const data = await res.json();
      setMascotas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarMascota = async (id) => {
    try {
      const confirmar = window.confirm("¿Seguro que deseas eliminar esta mascota?");
      if (!confirmar) return;

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/pets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMascotas((prev) => prev.filter((mascota) => mascota.id !== id));
        if (mascotaAbierta === id) {
          setMascotaAbierta(null);
        }
        alert("Mascota eliminada correctamente");
      } else {
        alert(data.error || "Error eliminando mascota");
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  const toggleMascota = (id) => {
    setMascotaAbierta((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    cargarMascotas();
  }, []);

  return (
    <PetOwnerLayout
      title="Mis Mascotas"
      subtitle="Gestiona la información de tus peludos"
    >

      {loading ? (
        <div className="pet-card">
          <h2>Cargando mascotas...</h2>
          <p>Espera un momento mientras obtenemos la información.</p>
        </div>
      ) : mascotas.length === 0 ? (
        <div className="pet-card">
          <h2>No tienes mascotas registradas</h2>
          <p>Agrega una mascota para comenzar a usar el sistema.</p>
        </div>
      ) : (
        mascotas.map((mascota) => {
          const abierta = mascotaAbierta === mascota.id;

          return (
            <div key={mascota.id} className="pet-pet-card">
              <div
                className="pet-pet-summary"
                onClick={() => toggleMascota(mascota.id)}
              >
                <div className="pet-pet-top">
                  <img
                    src={
                      mascota.foto ||
                      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={mascota.nombre}
                    className="pet-pet-image"
                  />

                  <div className="pet-pet-main">
                    <h3>{mascota.nombre}</h3>
                    <p className="pet-pet-race">{mascota.raza}</p>
                    <div className="pet-pet-meta">
                      <span>{mascota.edad} años</span>
                      <span>•</span>
                      <span>{mascota.peso} kg</span>
                    </div>
                  </div>

                  <div className={`pet-pet-arrow ${abierta ? "open" : ""}`}>
                    ⌄
                  </div>
                </div>
              </div>

              {abierta && (
                <div className="pet-pet-expanded">
                  <div className="pet-pet-alert">
                    <strong>🔔 ¡Vacuna próxima!</strong>
                    <p>Revisa el esquema de vacunación de {mascota.nombre}</p>
                  </div>

                  <div
                    className="pet-pet-action pet-pet-action-blue"
                    onClick={() => alert("Luego conectamos carnet de vacunación")}
                  >
                    <div>
                      <strong>📘 Carnet de Vacunación</strong>
                      <p>Consulta vacunas registradas</p>
                    </div>
                  </div>

                  <div
                    className="pet-pet-action pet-pet-action-green"
                    onClick={() => navigate("/dashboard/historia-clinica")}
                  >
                    <div>
                      <strong>🩺 Historia Clínica</strong>
                      <p>Ver historial médico</p>
                    </div>
                  </div>

                  <div
                    className="pet-pet-action pet-pet-action-orange"
                    onClick={() => alert("Luego conectamos documentos")}
                  >
                    <div>
                      <strong>📄 Documentos</strong>
                      <p>Certificados y registros</p>
                    </div>
                  </div>

                  <div className="pet-pet-info-box">
                    <p><strong>Tipo:</strong> {mascota.tipo || "No definido"}</p>
                    <p><strong>Raza:</strong> {mascota.raza}</p>
                    <p><strong>Edad:</strong> {mascota.edad} años</p>
                    <p><strong>Peso:</strong> {mascota.peso} kg</p>
                    <p><strong>Vacunas:</strong> {mascota.vacunas}</p>
                  </div>

                  <div className="pet-pet-crud">
                    <button
                      className="pet-edit-btn"
                      onClick={() => navigate(`/pet/editar-mascota/${mascota.id}`)}
                    >
                      Editar
                    </button>

                    <button
                      className="pet-delete-btn"
                      onClick={() => eliminarMascota(mascota.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )
      }
    </PetOwnerLayout>
  );
}

export default PetMascotas;