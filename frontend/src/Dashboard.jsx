import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;

  useEffect(() => {
    if (user?.rol === "pet_owner") {
      navigate("/pet/home");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <h2>No hay sesión activa</h2>
          <button className="dashboard-button" onClick={() => navigate("/")}>
            Ir al login
          </button>
        </div>
      </div>
    );
  }

  if (user.rol === "pet_owner") {
    return null;
  }

  return (
    <DashboardLayout title="🐾 Panel principal">
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>🏢 Mis empresas</h2>
          <p>Consulta y administra las empresas registradas en tu cuenta.</p>
          <button
            className="dashboard-button"
            onClick={() => navigate("/dashboard/empresas")}
          >
            Ver empresas
          </button>
        </div>

        <div className="dashboard-card">
          <h2>💼 Mis servicios</h2>
          <p>Gestiona los servicios que ofreces para mascotas.</p>
          <button
            className="dashboard-button"
            onClick={() => navigate("/dashboard/servicios")}
          >
            Ver servicios
          </button>
        </div>

        <div className="dashboard-card">
          <h2>📋 Citas recibidas</h2>
          <p>Revisa y confirma las citas agendadas por los usuarios.</p>
          <button
            className="dashboard-button"
            onClick={() => navigate("/dashboard/citas-empresa")}
          >
            Ver citas
          </button>
        </div>

        <div className="dashboard-card">
          <h2>🚀 Crecimiento</h2>
          <p>
            Desde este panel podrás administrar tu operación, servicios y relación
            con clientes.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;