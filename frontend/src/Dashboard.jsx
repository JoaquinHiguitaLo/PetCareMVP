import { useEffect, useState } from "react";
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

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [empresas, setEmpresas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    if (user?.rol === "pet_owner") {
      navigate("/pet/home");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.rol === "business") {
      cargarResumen();
    }
  }, []);

  const cargarResumen = async () => {
    try {
      const resEmpresas = await fetch(`${API_URL}/api/empresas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const dataEmpresas = await resEmpresas.json();
      const empresasLista = Array.isArray(dataEmpresas) ? dataEmpresas : [];
      setEmpresas(empresasLista);

      if (empresasLista.length > 0) {
        const empresaId = empresasLista[0].id;

        const [resServicios, resCitas] = await Promise.all([
          fetch(`${API_URL}/api/servicios/empresa/${empresaId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch(`${API_URL}/api/citas/empresa/${empresaId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);

        const dataServicios = await resServicios.json();
        const dataCitas = await resCitas.json();

        setServicios(Array.isArray(dataServicios) ? dataServicios : []);
        setCitas(Array.isArray(dataCitas) ? dataCitas : []);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  const serviciosActivos = servicios.filter((s) => s.disponible).length;
  const citasPendientes = citas.filter((c) => c.estado === "pendiente").length;
  const citasConfirmadas = citas.filter((c) => c.estado === "confirmada").length;

  const proximaCita = [...citas]
    .filter((c) => c.estado !== "cancelada" && c.estado !== "completada")
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0];

  return (
    <DashboardLayout title="📊 Resumen de tu negocio">
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>🏢 Empresas registradas</h2>
          <p>Tienes <strong>{empresas.length}</strong> empresa(s) registrada(s).</p>
        </div>

        <div className="dashboard-card">
          <h2>💼 Servicios activos</h2>
          <p>Tienes <strong>{serviciosActivos}</strong> servicio(s) disponible(s).</p>
        </div>

        <div className="dashboard-card">
          <h2>📋 Citas pendientes</h2>
          <p>Tienes <strong>{citasPendientes}</strong> cita(s) pendiente(s) por confirmar.</p>
          <p><strong>Confirmadas:</strong> {citasConfirmadas}</p>
        </div>

        <div className="dashboard-card">
          <h2>⏰ Próxima cita</h2>
          {proximaCita ? (
            <>
              <p><strong>Servicio:</strong> {proximaCita.servicio}</p>
              <p><strong>Usuario:</strong> {proximaCita.usuario}</p>
              <p><strong>Mascota:</strong> {proximaCita.mascota}</p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(proximaCita.fecha).toLocaleDateString()}
              </p>
              <p>
                <strong>Hora:</strong>{" "}
                {new Date(proximaCita.fecha).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </>
          ) : (
            <p>No tienes próximas citas agendadas.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;