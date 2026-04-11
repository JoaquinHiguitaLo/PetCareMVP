import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PetOwnerLayout from "./components/PetOwnerLayout";
import "./petOwner.css";

function PetEmpresasCategoria() {
  const [empresas, setEmpresas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const categoria = params.get("nombre") || "";

  const cargarEmpresas = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/empresas/categoria/${encodeURIComponent(categoria)}`
      );
      const data = await res.json();
      setEmpresas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (categoria) {
      cargarEmpresas();
    }
  }, [categoria]);

  const empresasFiltradas = useMemo(() => {
    return empresas.filter((empresa) => {
      const texto = `${empresa.nombre} ${empresa.descripcion || ""} ${empresa.direccion || ""}`.toLowerCase();
      return texto.includes(busqueda.toLowerCase());
    });
  }, [empresas, busqueda]);

  const verServicios = (empresa) => {
    navigate(`/pet/empresa/${empresa.id}`);
  };

  return (
    <PetOwnerLayout
      title={categoria || "Categoría"}
      subtitle={`${empresasFiltradas.length} socios disponibles`}
    >
      <div className="pet-filter-row">
        <button className="pet-filter-chip active">Todos</button>
        <button className="pet-filter-chip">⭐ +4.8</button>
        <button className="pet-filter-chip">🎁 Promociones</button>
        <button className="pet-filter-chip">🏆 Top</button>
      </div>

      <input
        className="pet-search"
        placeholder={`🔍 Buscar en ${categoria || "categoría"}...`}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div style={{ height: "16px" }} />

      {empresasFiltradas.length === 0 ? (
        <div className="pet-card">
          <h2>Sin resultados</h2>
          <p>No se encontraron empresas para esta categoría.</p>
        </div>
      ) : (
        empresasFiltradas.map((empresa) => (
          <div key={empresa.id} className="pet-company-card">
            <div className="pet-company-image-wrapper">
              <img
                src={
                  empresa.imagen ||
                  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80"
                }
                alt={empresa.nombre}
                className="pet-company-image"
              />

              {empresa.promocion && (
                <span className="pet-promo-badge">🎁 Promoción</span>
              )}
            </div>

            <div className="pet-company-body">
              <h3>{empresa.nombre}</h3>

              <div className="pet-company-meta">
                <span>⭐ {empresa.rating || 4.5}</span>
                <span>•</span>
                <span>📍 {empresa.distancia_km || 1.0} km</span>
              </div>

              {empresa.tags && empresa.tags.length > 0 && (
                <div className="pet-tag-list">
                  {empresa.tags.map((tag, index) => (
                    <span key={index} className="pet-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <button
                className="pet-primary-button"
                style={{ marginTop: "14px" }}
                onClick={() => verServicios(empresa)}
              >
                Ver servicios
              </button>
            </div>
          </div>
        ))
      )}
    </PetOwnerLayout>
  );
}

export default PetEmpresasCategoria;