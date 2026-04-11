import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PetOwnerLayout from "./components/PetOwnerLayout";
import "./petOwner.css";

function PetEmpresaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [empresa, setEmpresa] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [tabActiva, setTabActiva] = useState("servicios");

  const cargarEmpresa = async () => {
    try {
      const res = await fetch(`${API_URL}/api/empresas/${id}/detalle`);
      const data = await res.json();
      setEmpresa(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarServicios = async () => {
    try {
      const res = await fetch(`${API_URL}/api/servicios/empresa/${id}`);
      const data = await res.json();
      setServicios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarEmpresa();
    cargarServicios();
  }, [id]);

  const irAAgendar = (servicio) => {
    navigate(`/pet/agendar-cita?servicio_id=${servicio.id}&empresa_id=${id}`);
  };

  if (!empresa) {
    return (
      <PetOwnerLayout title="Empresa" subtitle="Cargando...">
        <div className="pet-card">Cargando información...</div>
      </PetOwnerLayout>
    );
  }

  return (
    <PetOwnerLayout title="" subtitle="">
      <div className="pet-detail-card">
        <div className="pet-detail-image-wrapper">
          <img
            src={
              empresa.imagen ||
              "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80"
            }
            alt={empresa.nombre}
            className="pet-detail-image"
          />

          <button
            className="pet-back-button"
            onClick={() => navigate(`/pet/categoria?nombre=${encodeURIComponent(empresa.categoria)}`)}
          >
            ←
          </button>
        </div>

        <div className="pet-detail-body">
          <h2>{empresa.nombre}</h2>

          <div className="pet-detail-rating">
            <span>⭐ {empresa.rating || 4.5}</span>
            <span>•</span>
            <span>({empresa.resenas || 0} reseñas)</span>
          </div>

          <p className="pet-detail-description">
            {empresa.descripcion || "Sin descripción disponible"}
          </p>

          <div className="pet-detail-info">
            <div>📍 {empresa.distancia_km || 1.0} km</div>
            <div>🕒 {empresa.horario || "Horario no disponible"}</div>
            <div>📞 {empresa.telefono || "Sin teléfono"}</div>
          </div>
        </div>

        <div className="pet-detail-tabs">
          <button
            className={tabActiva === "productos" ? "active" : ""}
            onClick={() => setTabActiva("productos")}
          >
            Productos
          </button>

          <button
            className={tabActiva === "servicios" ? "active" : ""}
            onClick={() => setTabActiva("servicios")}
          >
            Servicios
          </button>
        </div>

        <div className="pet-detail-tab-content">
          {tabActiva === "productos" ? (
            <div className="pet-card">
              Próximamente podrás ver productos de esta empresa.
            </div>
          ) : servicios.length === 0 ? (
            <div className="pet-card">No hay servicios disponibles.</div>
          ) : (
            servicios.map((servicio) => (
              <div key={servicio.id} className="pet-service-item">
                <div className="pet-service-left">
                  <div className="pet-service-icon">🩺</div>

                  <div>
                    <h3>{servicio.nombre}</h3>
                    <p className="pet-service-price">${Number(servicio.precio).toLocaleString()}</p>
                    <p className="pet-service-duration">⏱ {servicio.duracion_min || 30} min</p>
                  </div>
                </div>

                <button
                  className="pet-add-button"
                  onClick={() => navigate(`/pet/agendar-cita/${servicio.id}?empresaId=${empresa.id}`)}
                >
                  Agendar cita
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </PetOwnerLayout>
  );
}

export default PetEmpresaDetalle;