import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PetOwnerLayout from "./components/PetOwnerLayout";
import "./petOwner.css";

function PetServicios() {
  const [servicios, setServicios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const categoria = params.get("categoria") || "";

  const cargarServicios = async () => {
    try {
      const res = await fetch(`${API_URL}/api/servicios`);
      const data = await res.json();
      setServicios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  const serviciosFiltrados = useMemo(() => {
    return servicios.filter((servicio) => {
      const texto = `${servicio.nombre} ${servicio.descripcion} ${servicio.empresa_nombre}`.toLowerCase();
      const coincideBusqueda = texto.includes(busqueda.toLowerCase());

      if (!categoria) return coincideBusqueda;

      const categoriaLower = categoria.toLowerCase();

      const coincideCategoria =
        servicio.categoria &&
        servicio.categoria.toLowerCase() === categoriaLower;

      return coincideBusqueda && coincideCategoria;
    });
  }, [servicios, busqueda, categoria]);

  const irAAgendar = (servicio) => {
    navigate(`/pet/agendar-cita?servicio_id=${servicio.id}`);
  };

  return (
    <PetOwnerLayout
      title="Servicios"
      subtitle={categoria ? `Categoría: ${categoria}` : "Explora servicios disponibles"}
    >
      <input
        className="pet-search"
        placeholder="🔍 Buscar servicios o empresas..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div style={{ height: "16px" }} />

      <div className="pet-card">
        <h2>Resultados</h2>

        {serviciosFiltrados.length === 0 ? (
          <p>No se encontraron servicios disponibles.</p>
        ) : (
          serviciosFiltrados.map((servicio) => (
            <div key={servicio.id} className="pet-business-card">
              <h3>{servicio.nombre}</h3>
              <p><strong>Empresa:</strong> {servicio.empresa_nombre}</p>
              <p style={{ marginTop: "8px" }}>{servicio.descripcion}</p>
              <p style={{ marginTop: "8px" }}><strong>Precio:</strong> ${servicio.precio}</p>

              <button
                className="pet-primary-button"
                onClick={() => irAAgendar(servicio)}
                style={{ marginTop: "12px" }}
              >
                Agendar cita
              </button>
            </div>
          ))
        )}
      </div>
    </PetOwnerLayout>
  );
}

export default PetServicios;