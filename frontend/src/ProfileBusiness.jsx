import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { showError, showSuccess } from "./utils/alerts";
import "./dashboard.css";

function ProfileBusiness() {
  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [editando, setEditando] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [citas, setCitas] = useState([]);

  const [form, setForm] = useState({
    id: "",
    nombre: "",
    telefono: "",
    email: ""
  });

  useEffect(() => {
    if (user) {
      setForm({
        id: user.id || "",
        nombre: user.nombre || "",
        telefono: user.telefono || "",
        email: user.email || ""
      });
    }
  }, [user]);

  useEffect(() => {
    cargarResumen();
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
      showError("Error", "No se pudo cargar el resumen del perfil");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const guardarPerfil = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id: form.id,
          nombre: form.nombre,
          telefono: form.telefono
        })
      });

      const data = await res.json();

      if (res.ok) {
        const userActualizado = {
          ...user,
          nombre: data.user.nombre,
          telefono: data.user.telefono
        };

        localStorage.setItem("user", JSON.stringify(userActualizado));
        await showSuccess("Perfil actualizado", "Tus datos se guardaron correctamente");
        setEditando(false);
      } else {
        showError("Error", data.error || "No se pudo actualizar el perfil");
      }
    } catch (error) {
      console.error(error);
      showError("Error", "Error conectando con el servidor");
    }
  };

  const serviciosActivos = servicios.filter((s) => s.disponible).length;
  const citasPendientes = citas.filter((c) => c.estado === "pendiente").length;

  const iniciales =
    form.nombre?.trim()?.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "BU";

  return (
    <DashboardLayout title="👤 Mi perfil">
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="business-profile-summary">
            <div className="business-profile-avatar">{iniciales}</div>

            <div className="business-profile-info">
              <h2>{form.nombre || "Usuario empresa"}</h2>
              <p>{form.email}</p>
              <span className="business-profile-badge">Empresa</span>
            </div>
          </div>

          <div className="business-profile-form">
            <label>Nombre</label>
            <input
              className="dashboard-input"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              disabled={!editando}
            />

            <label>Correo</label>
            <input
              className="dashboard-input"
              name="email"
              value={form.email}
              disabled
            />

            <label>Teléfono</label>
            <input
              className="dashboard-input"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              disabled={!editando}
            />

            {!editando ? (
              <button
                className="dashboard-button"
                onClick={() => setEditando(true)}
              >
                Editar perfil
              </button>
            ) : (
              <div className="dashboard-actions" style={{ marginTop: "10px" }}>
                <button
                  className="dashboard-button"
                  onClick={guardarPerfil}
                >
                  Guardar cambios
                </button>

                <button
                  className="dashboard-button"
                  style={{ background: "#6b7280" }}
                  onClick={() => {
                    setEditando(false);
                    setForm({
                      id: user.id || "",
                      nombre: user.nombre || "",
                      telefono: user.telefono || "",
                      email: user.email || ""
                    });
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>📊 Resumen de tu cuenta</h2>

          <div className="dashboard-item">
            <p><strong>Empresas registradas:</strong> {empresas.length}</p>
            <p><strong>Servicios activos:</strong> {serviciosActivos}</p>
            <p><strong>Citas pendientes:</strong> {citasPendientes}</p>
            <p><strong>Rol:</strong> business</p>
          </div>

          <button
            className="dashboard-button"
            style={{ background: "#ef4444", marginTop: "12px" }}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProfileBusiness;