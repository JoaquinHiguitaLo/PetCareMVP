import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PetOwnerLayout from "./components/PetOwnerLayout";
import "./petOwner.css";

function PetHistoriaClinica() {
  const { mascotaId } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historias, setHistorias] = useState([]);

  
  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;

  const cargarMascota = async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/pets/user/${user.id}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        const encontrada = data.find(
          (item) => Number(item.id) === Number(mascotaId)
        );

        setMascota(encontrada || null);
      }
    } catch (error) {
      console.error("Error cargando mascota:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarHistorias = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/historias/mascota/${mascotaId}`
      );

      const data = await res.json();

      setHistorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando historias:", error);
    }
  };

  useEffect(() => {
    cargarMascota();
    cargarHistorias();
  }, [mascotaId]);

  return (
    <PetOwnerLayout
      title="Historia clínica"
      subtitle="Consulta la información médica de tu mascota"
    >
      {loading ? (
        <div className="pet-card">
          <h2>Cargando historia clínica...</h2>
          <p>Espera un momento mientras obtenemos la información.</p>
        </div>
      ) : (
        <>
          <div className="pet-card">
            <h2>🐾 {mascota ? mascota.nombre : "Mascota no encontrada"}</h2>
            <p><strong>Tipo:</strong> {mascota?.tipo || "No definido"}</p>
            <p><strong>Raza:</strong> {mascota?.raza || "No registrada"}</p>
            <p><strong>Edad:</strong> {mascota?.edad || "No registrada"} años</p>
            <p><strong>Peso:</strong> {mascota?.peso || "No registrado"} kg</p>
            <p><strong>Vacunas:</strong> {mascota?.vacunas || "No registradas"}</p>
          </div>

          <div className="pet-card">
            <h2>🩺 Registros médicos</h2>

            {historias.length === 0 ? (
              <p>Por ahora no hay registros clínicos asociados a esta mascota.</p>
            ) : (
              historias.map((historia) => (
                <div key={historia.id} className="pet-cita-item">
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {historia.fecha
                      ? new Date(historia.fecha).toLocaleDateString()
                      : "Sin fecha"}
                  </p>

                  <p>
                    <strong>Diagnóstico:</strong> {historia.diagnostico}
                  </p>

                  <p>
                    <strong>Tratamiento:</strong> {historia.tratamiento}
                  </p>

                  <p>
                    <strong>Observaciones:</strong> {historia.observaciones}
                  </p>
                </div>
              ))
            )}
          </div>

          <button
            className="pet-primary-button"
            onClick={() => navigate("/pet/mascotas")}
          >
            Volver a mis mascotas
          </button>
        </>
      )}
    </PetOwnerLayout>
  );
}

export default PetHistoriaClinica;