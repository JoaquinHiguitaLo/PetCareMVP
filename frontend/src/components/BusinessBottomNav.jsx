import { useLocation, useNavigate } from "react-router-dom";
import "../sidebar.css";

function BusinessBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const irA = (ruta) => {
    navigate(ruta);
  };

  const activa = (ruta) => location.pathname === ruta;

  return (
    <nav className="business-bottom-nav">
      <button
        className={activa("/dashboard") ? "active" : ""}
        onClick={() => irA("/dashboard")}
      >
        🏠
        <span>Inicio</span>
      </button>

      <button
        className={activa("/dashboard/empresas") ? "active" : ""}
        onClick={() => irA("/dashboard/empresas")}
      >
        🏢
        <span>Empresas</span>
      </button>

      <button
        className={activa("/dashboard/servicios") ? "active" : ""}
        onClick={() => irA("/dashboard/servicios")}
      >
        💼
        <span>Servicios</span>
      </button>

      <button
        className={activa("/dashboard/citas-empresa") ? "active" : ""}
        onClick={() => irA("/dashboard/citas-empresa")}
      >
        📋
        <span>Citas</span>
      </button>

      <button
        className={activa("/dashboard/perfil") ? "active" : ""}
        onClick={() => irA("/dashboard/perfil")}
      >
        👤
        <span>Perfil</span>
      </button>

    </nav>
  );
}

export default BusinessBottomNav;