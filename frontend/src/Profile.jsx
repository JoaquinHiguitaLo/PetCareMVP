import { useNavigate } from "react-router-dom";
import PetOwnerLayout from "./components/PetOwnerLayout";
import "./petOwner.css";

function Profile() {
  const navigate = useNavigate();

  const storedUserRaw = localStorage.getItem("user");
  const user =
    storedUserRaw && storedUserRaw !== "undefined"
      ? JSON.parse(storedUserRaw)
      : null;

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const iniciales = user?.nombre
    ? user.nombre
        .split(" ")
        .slice(0, 2)
        .map((parte) => parte[0]?.toUpperCase())
        .join("")
    : "JD";

  return (
    <PetOwnerLayout title="Mi Perfil" subtitle="Gestiona tu cuenta">
      <div className="pet-profile-summary-card">
        <div className="pet-profile-avatar">{iniciales}</div>

        <div className="pet-profile-summary-info">
          <h3>{user?.nombre || "Usuario PetCare"}</h3>
          <p>{user?.email || "correo@ejemplo.com"}</p>
          <span className="pet-profile-badge">Básico</span>
        </div>
      </div>

      <div
        className="pet-profile-option"
        onClick={() => navigate("/pet/editar-perfil")}
      >
        <span>👤 Editar perfil</span>
        <span>›</span>
      </div>

      <div
        className="pet-profile-option"
        onClick={() => navigate("/pet/mis-citas")}
      >
        <span>📅 Ver citas</span>
        <span>›</span>
      </div>

      <div className="pet-profile-option">
        <span>🛍️ Ver reservaciones</span>
        <span>›</span>
      </div>

      <div className="pet-profile-option">
        <span>💳 Métodos de pago</span>
        <span>›</span>
      </div>

      <div className="pet-profile-option">
        <span>📍 Direcciones</span>
        <span>›</span>
      </div>

      <div className="pet-profile-option">
        <span>👑 Plan Premium</span>
        <span>›</span>
      </div>

      <div className="pet-profile-option">
        <span>❓ Ayuda</span>
        <span>›</span>
      </div>

      <button className="pet-profile-logout" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </PetOwnerLayout>
  );
}

export default Profile;