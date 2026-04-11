import { useNavigate, useLocation } from "react-router-dom";
import "../petOwner.css";

function PetOwnerLayout({ title, subtitle, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const irA = (ruta) => {
    navigate(ruta);
  };

  const activa = (ruta) => location.pathname === ruta;

  return (
    <div className="pet-layout">
      <div className="pet-desktop-shell">
        <div className="pet-desktop-side">
          <h2>PetCare</h2>
          <p>
            Plataforma orientada a centralizar servicios y productos para el cuidado de mascotas
            en un solo entorno digital. Su propósito es conectar dueños de mascotas con veterinarias,
            guarderías, tiendas, aseguradoras, parques, funerarias y otros actores del ecosistema pet-friendly,
            permitiendo encontrar opciones confiables, comparables y ajustadas a las necesidades específicas de cada usuario.
          </p>
          <div className="pet-desktop-points">
            <div className="pet-desktop-point">📱 Orientada a una experiencia mobile-first</div>
            <div className="pet-desktop-point">🩺 Gestión de mascotas, citas e historia clínica</div>
            <div className="pet-desktop-point">💬 Espacio para comunidad y crecimiento del producto</div>
          </div>
        </div>

        <div className="pet-screen">
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

          <main className="pet-content pet-mobile-wrapper">
            {children}
          </main>

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
        </div>
      </div>
    </div>
  );
}

export default PetOwnerLayout;