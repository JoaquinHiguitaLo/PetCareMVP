import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../petOwner.css";

function PetOwnerLayout({ title, subtitle, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const irA = (ruta) => {
    navigate(ruta);
  };

  const activa = (ruta) => location.pathname === ruta;

  return (
    <div className="pet-layout">
      <div className="pet-app-shell">
        {!isMobile && (
          <aside className="pet-desktop-sidebar">
            <div className="pet-desktop-sidebar-header">
              <h2>🐾 PetCare</h2>
              <p>Pet Owner</p>
            </div>

            <nav className="pet-desktop-sidebar-nav">
              <button
                className={`pet-desktop-sidebar-link ${activa("/pet/home") ? "active" : ""}`}
                onClick={() => irA("/pet/home")}
              >
                🏠 Inicio
              </button>

              <button
                className={`pet-desktop-sidebar-link ${activa("/pet/mascotas") ? "active" : ""}`}
                onClick={() => irA("/pet/mascotas")}
              >
                🐶 Mascotas
              </button>

              <button
                className={`pet-desktop-sidebar-link ${activa("/pet/mis-citas") ? "active" : ""}`}
                onClick={() => irA("/pet/mis-citas")}
              >
                📅 Citas
              </button>

              <button
                className={`pet-desktop-sidebar-link ${activa("/pet/perfil") ? "active" : ""}`}
                onClick={() => irA("/pet/perfil")}
              >
                👤 Perfil
              </button>
            </nav>

            <div className="pet-desktop-sidebar-footer">
              <button
                className="pet-desktop-logout"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/");
                }}
              >
                Cerrar sesión
              </button>
            </div>
          </aside>
        )}

        <main className="pet-main">
          <div className="pet-main-content">
            {!isMobile && (
              <div className="pet-desktop-hero">
                <p className="pet-desktop-hero-label">Panel pet owner</p>
                <h1 className="pet-desktop-hero-title">{title}</h1>
                {subtitle && (
                  <p className="pet-desktop-hero-subtitle">{subtitle}</p>
                )}
              </div>
            )}

            <div className="pet-screen">
              {isMobile && (
                <header className="pet-header">
                  <div className="pet-header-row">
                    <div>
                      <h1>{title}</h1>
                      {subtitle && <p>{subtitle}</p>}
                    </div>

                    {title === "Mis Mascotas" && (
                      <button
                        className="pet-header-plus"
                        onClick={() => navigate("/pet/crear-mascota")}
                      >
                        +
                      </button>
                    )}
                  </div>
                </header>
              )}

              <main className={`pet-content ${isMobile ? "pet-mobile-wrapper" : ""}`}>
                {children}
              </main>

              {isMobile && (
                <nav className="pet-bottom-nav">
                  <button
                    className={activa("/pet/mascotas") ? "active" : ""}
                    onClick={() => irA("/pet/mascotas")}
                  >
                    🐶
                    <span>Mascotas</span>
                  </button>

                  <button
                    className={activa("/pet/home") ? "active" : ""}
                    onClick={() => irA("/pet/home")}
                  >
                    🏠
                    <span>Inicio</span>
                  </button>

                  <button
                    className={activa("/pet/mis-citas") ? "active" : ""}
                    onClick={() => irA("/pet/mis-citas")}
                  >
                    📅
                    <span>Citas</span>
                  </button>

                  <button
                    className={activa("/pet/perfil") ? "active" : ""}
                    onClick={() => irA("/pet/perfil")}
                  >
                    👤
                    <span>Perfil</span>
                  </button>
                </nav>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PetOwnerLayout;