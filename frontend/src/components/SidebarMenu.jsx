import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../sidebar.css";

function SidebarMenu({ user }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [seccionAbierta, setSeccionAbierta] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const toggleSeccion = (nombre) => {
    setSeccionAbierta(seccionAbierta === nombre ? "" : nombre);
  };

  const irA = (ruta) => {
    setMenuAbierto(false);
    navigate(ruta);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    setMenuAbierto(false);
  }, [location.pathname]);

  return (
    <>
      <button className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
        ☰
      </button>

      <aside className={`sidebar ${menuAbierto ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>🐾 PetCare</h2>
          <p>{user?.nombre || "Usuario"}</p>
          <span className="sidebar-role">{user?.rol}</span>
        </div>

        <nav className="sidebar-nav">
          <button className="sidebar-link" onClick={() => irA("/dashboard")}>
            🏠 Inicio
          </button>

          {user?.rol === "pet_owner" && (
            <>
              <div className="sidebar-section">
                <button className="sidebar-link" onClick={() => toggleSeccion("mascotas")}>
                  🐶 Mascotas
                </button>
                {seccionAbierta === "mascotas" && (
                  <div className="sidebar-submenu">
                    <button onClick={() => irA("/dashboard/mascotas")}>Ver mascotas</button>
                  </div>
                )}
              </div>

              <div className="sidebar-section">
                <button className="sidebar-link" onClick={() => toggleSeccion("historias")}>
                  🩺 Historia clínica
                </button>
                {seccionAbierta === "historias" && (
                  <div className="sidebar-submenu">
                    <button onClick={() => irA("/dashboard/historia-clinica")}>Ver historias</button>
                  </div>
                )}
              </div>

              <div className="sidebar-section">
                <button className="sidebar-link" onClick={() => toggleSeccion("citas")}>
                  📅 Citas
                </button>
                {seccionAbierta === "citas" && (
                  <div className="sidebar-submenu">
                    <button onClick={() => irA("/dashboard/citas")}>Ver citas</button>
                  </div>
                )}
              </div>
            </>
          )}

          {user?.rol === "business" && (
            <>
              <div className="sidebar-section">
                <button className="sidebar-link" onClick={() => toggleSeccion("empresas")}>
                  🏥 Empresas
                </button>
                {seccionAbierta === "empresas" && (
                  <div className="sidebar-submenu">
                    <button onClick={() => irA("/dashboard/empresas")}>Ver empresas</button>
                  </div>
                )}
              </div>

              <div className="sidebar-section">
                <button className="sidebar-link" onClick={() => toggleSeccion("servicios")}>
                  💼 Servicios
                </button>
                {seccionAbierta === "servicios" && (
                  <div className="sidebar-submenu">
                    <button onClick={() => irA("/dashboard/servicios")}>Ver servicios</button>
                  </div>
                )}
              </div>

              <div className="sidebar-section">
                <button className="sidebar-link" onClick={() => toggleSeccion("citasEmpresa")}>
                  📋 Citas recibidas
                </button>
                {seccionAbierta === "citasEmpresa" && (
                  <div className="sidebar-submenu">
                    <button onClick={() => irA("/dashboard/citas-empresa")}>Ver citas</button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {menuAbierto && <div className="sidebar-overlay" onClick={() => setMenuAbierto(false)} />}
    </>
  );
}

export default SidebarMenu;