import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../sidebar.css";

function SidebarMenu({ user }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const irA = (ruta) => {
    setMenuAbierto(false);
    navigate(ruta);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const activa = (ruta) => location.pathname === ruta;

  useEffect(() => {
    setMenuAbierto(false);
  }, [location.pathname]);

  return (
    <>
      <button className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
        ☰
      </button>

      <aside className={`sidebar business-sidebar ${menuAbierto ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>🐾 PetCare</h2>
          <p>{user?.nombre || "Usuario"}</p>
          <span className="sidebar-role">
            {user?.rol === "business" ? "Empresa" : user?.rol}
          </span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-link ${activa("/dashboard") ? "active" : ""}`}
            onClick={() => irA("/dashboard")}
          >
            🏠 Inicio
          </button>

          <button
            className={`sidebar-link ${activa("/dashboard/empresas") ? "active" : ""}`}
            onClick={() => irA("/dashboard/empresas")}
          >
            🏢 Empresas
          </button>

          <button
            className={`sidebar-link ${activa("/dashboard/servicios") ? "active" : ""}`}
            onClick={() => irA("/dashboard/servicios")}
          >
            💼 Servicios
          </button>

          <button
            className={`sidebar-link ${activa("/dashboard/citas-empresa") ? "active" : ""}`}
            onClick={() => irA("/dashboard/citas-empresa")}
          >
            📋 Citas recibidas
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {menuAbierto && (
        <div className="sidebar-overlay" onClick={() => setMenuAbierto(false)} />
      )}
    </>
  );
}

export default SidebarMenu;