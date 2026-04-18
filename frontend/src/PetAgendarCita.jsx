import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {showError, showSucces} from "./utils/alerts";
import PetOwnerLayout from "./components/PetOwnerLayout";
import LoadingModal from "./components/LoadingModal";
import "./petOwner.css";

function PetAgendarCita() {
  const { servicioId } = useParams();
  const [searchParams] = useSearchParams();
  const empresaId = searchParams.get("empresaId");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [mascotas, setMascotas] = useState([]);
  const [servicio, setServicio] = useState(null);

  const [form, setForm] = useState({
    mascota_id: "",
    fecha: "",
    hora: ""
  });

  const cargarDatos = async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const [resMascotas, resServicios] = await Promise.all([
        fetch(`${API_URL}/api/pets/user/${user.id}`),
        fetch(`${API_URL}/api/servicios/empresa/${empresaId}`)
      ]);

      const dataMascotas = await resMascotas.json();
      const dataServicios = await resServicios.json();

      setMascotas(Array.isArray(dataMascotas) ? dataMascotas : []);

      if (Array.isArray(dataServicios)) {
        const servicioEncontrado = dataServicios.find(
          (s) => String(s.id) === String(servicioId)
        );
        setServicio(servicioEncontrado || null);
      }
    } catch (error) {
      console.error(error);
      showError("Error","Error cargando la información para agendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [servicioId, empresaId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (guardando) return;
    setGuardando(true);

    try {
      const fechaHora = `${form.fecha}T${form.hora}:00`;

      const body = {
        usuario_id: user.id,
        mascota_id: Number(form.mascota_id),
        servicio_id: Number(servicioId),
        empresa_id: Number(empresaId),
        fecha: fechaHora
      };

      const res = await fetch(`${API_URL}/api/citas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess("Cita agendada","Cita agendada correctamente");
        navigate("/pet/mis-citas");
      } else {
        showError("Error", data.error || "Error agendando cita");
        setGuardando(false);
      }
    } catch (error) {
      console.error(error);
      showError("Error", "Error conectando con el servidor");
      setGuardando(false);
    }
  };

  return (
    <>
      {loading && <LoadingModal text="Cargando información..." />}
      {guardando && <LoadingModal text="Agendando cita..." />}

      <PetOwnerLayout
        title="Agendar cita"
        subtitle="Selecciona tu mascota y la fecha"
      >
        <div className="pet-card">
          {servicio && (
            <div className="pet-service-summary">
              <h3>{servicio.nombre}</h3>
              <p>{servicio.descripcion}</p>
              <p className="pet-service-price">
                ${Number(servicio.precio).toLocaleString()}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="pet-form-wrapper">
            <div className="pet-form-card">
              <label>Mascota *</label>
              <select
                name="mascota_id"
                value={form.mascota_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una mascota</option>
                {mascotas.map((mascota) => (
                  <option key={mascota.id} value={mascota.id}>
                    {mascota.nombre} - {mascota.raza}
                  </option>
                ))}
              </select>

              <label>Fecha *</label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                required
              />

              <label>Hora *</label>
              <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
                required
              />

              <div className="pet-form-submit">
                <button
                  type="submit"
                  className="pet-primary-button"
                  disabled={guardando}
                >
                  {guardando ? "Agendando..." : "Confirmar cita"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </PetOwnerLayout>
    </>
  );
}

export default PetAgendarCita;