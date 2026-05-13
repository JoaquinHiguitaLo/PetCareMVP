import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PetOwnerLayout from "./components/PetOwnerLayout";
import "./petOwner.css";
import { showError, showSuccess } from "./utils/alerts";

function PetMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [mascotaAbierta, setMascotaAbierta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

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
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setMascotas((prev) => prev.filter((mascota) => mascota.id !== id));

        if (mascotaAbierta === id) {
          setMascotaAbierta(null);
        }

        showSuccess("Mascota eliminada correctamente");
      } else {
        showError(data.error || "Error eliminando mascota");
      }
    } catch (error) {
      console.error(error);
      showError("Error conectando con el servidor");
    }
  };

  const toggleMascota = (id) => {
    setMascotaAbierta((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    cargarMascotas();
  }, []);

  const mascotasFiltradas = mascotas.filter((mascota) => {
    const texto = `${mascota.nombre || ""} ${mascota.raza || ""} ${mascota.tipo || ""}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <PetOwnerLayout
      title="Mis Mascotas"
      subtitle="Gestiona la información de tus peludos"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap"
        }}
      >
        <input
          type="text"
          placeholder="🔍 Buscar mascota..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            flex: 1,
            minWidth: "250px",
            padding: "14px 18px",
            borderRadius: "14px",
            border: "1px solid #ddd",
            fontSize: "15px",
            outline: "none",
            background: "#fff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
          }}
        />

        <button
          onClick={() => navigate("/pet/crear-mascota")}
          style={{
            background: "linear-gradient(135deg, #7b2ff7, #d500f9)",
            color: "white",
            border: "none",
            borderRadius: "14px",
            padding: "14px 22px",
            fontWeight: "600",
            fontSize: "15px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 6px 18px rgba(123,47,247,0.3)",
            transition: "0.2s"
          }}
        >
          ➕ Registrar mascota
        </button>
      </div>

      {loading ? (
        <div className="pet-card">
          <h2>Cargando mascotas...</h2>
          <p>Espera un momento mientras obtenemos la información.</p>
        </div>
      ) : mascotas.length === 0 ? (
        <div className="pet-card">
          <h2>No tienes mascotas registradas</h2>
          <p>Agrega una mascota para comenzar a usar el sistema.</p>

          <button
            className="pet-primary-button"
            onClick={() => navigate("/pet/crear-mascota")}
          >
            ➕ Registrar mascota
          </button>
        </div>
      ) : mascotasFiltradas.length === 0 ? (
        <div className="pet-card">
          <h2>Sin resultados</h2>
          <p>No encontramos mascotas con esa búsqueda.</p>
        </div>
      ) : (
        mascotasFiltradas.map((mascota) => {
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
                    onClick={() => showError("Aun no se ha conectado, se espera agregar funcionalidad de carnet de vacunación")}
                  >
                    <strong>📘 Carnet de Vacunación</strong>
                    <p>Consulta vacunas registradas</p>
                  </div>

                  <div
                    className="pet-pet-action pet-pet-action-green"
                    onClick={() => navigate(`/pet/historia-clinica/${mascota.id}`)}
                  >
                    <strong>🩺 Historia Clínica</strong>
                    <p>Ver historial médico</p>
                  </div>

                  <div
                    className="pet-pet-action pet-pet-action-orange"
                    onClick={() => showError("Aun no se ha conectado, se espera agregar funcionalidad de documentos")}
                  >
                    <strong>📄 Documentos</strong>
                    <p>Certificados y registros</p>
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
      )}
    </PetOwnerLayout>
  );
}

export default PetMascotas;