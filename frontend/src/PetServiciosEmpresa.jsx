import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PetOwnerLayout from "./components/PetOwnerLayout";

function PetServiciosEmpresa() {
  const { id } = useParams();
  const [servicios, setServicios] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const cargarServicios = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/servicios/empresa/${id}`
      );

      const data = await res.json();
      setServicios(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  return (
    <PetOwnerLayout
      title="Servicios"
      subtitle="Selecciona uno para agendar"
    >
      {servicios.length === 0 ? (
        <div className="pet-card">
          No hay servicios disponibles
        </div>
      ) : (
        servicios.map((servicio) => (
          <div key={servicio.id} className="pet-company-card">
            <img
              src={
                servicio.imagen ||
                "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7"
              }
              className="pet-company-image"
            />

            <div className="pet-company-body">
              <h3>{servicio.nombre}</h3>

              <p>{servicio.descripcion}</p>

              <div
                style={{
                  fontWeight: "700",
                  marginTop: "8px",
                }}
              >
                ${servicio.precio}
              </div>

              <button
                className="pet-primary-button"
                style={{ marginTop: "14px" }}
              >
                Agendar cita
              </button>
            </div>
          </div>
        ))
      )}
    </PetOwnerLayout>
  );
}

export default PetServiciosEmpresa;