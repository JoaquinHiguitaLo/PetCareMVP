import { useNavigate } from "react-router-dom";
import PetOwnerLayout from "./components/PetOwnerLayout";
import "./petOwner.css";

function PetHome() {
  const navigate = useNavigate();

  const irACategoria = (categoria) => {
    navigate(`/pet/categoria?nombre=${encodeURIComponent(categoria)}`);
  };

  return (
    <PetOwnerLayout
      title="Inicio"
      subtitle="Encuentra servicios para tu mejor amigo"
    >
      <input
        className="pet-search"
        placeholder="🔍 Buscar veterinarias, spas, tiendas..."
      />

      <div className="pet-card">
        <h2>Categorías</h2>

        <div className="pet-grid">
          <div className="pet-category" onClick={() => irACategoria("Veterinarias")}>
            <span>🩺</span>
            <h3>Veterinarias</h3>
          </div>

          <div className="pet-category" onClick={() => irACategoria("Spas")}>
            <span>✂️</span>
            <h3>Spas</h3>
          </div>

          <div className="pet-category" onClick={() => irACategoria("Tiendas")}>
            <span>🛍️</span>
            <h3>Tiendas</h3>
          </div>

          <div className="pet-category" onClick={() => irACategoria("Guarderías")}>
            <span>🏠</span>
            <h3>Guarderías</h3>
          </div>

          <div className="pet-category" onClick={() => irACategoria("Entrenadores")}>
            <span>🐕</span>
            <h3>Entrenadores</h3>
          </div>

          <div className="pet-category" onClick={() => irACategoria("Funerarias")}>
            <span>🌼</span>
            <h3>Funerarias</h3>
          </div>
        </div>
      </div>

      <div className="pet-card">
        <h2>Destacados cerca de ti</h2>

        <div className="pet-business-card">
          <h3>Veterinaria Central</h3>
          <p>Consulta general, vacunas y urgencias</p>
        </div>

        <div className="pet-business-card">
          <h3>Spa Huellitas</h3>
          <p>Baño, corte y cuidado estético</p>
        </div>
      </div>
    </PetOwnerLayout>
  );
}

export default PetHome;