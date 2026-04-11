import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PetOwnerLayout from "./components/PetOwnerLayout";
import PetForm from "./components/PetForm";
import LoadingModal from "./components/LoadingModal";
import "./petOwner.css";

function PetEditarMascota() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    raza: "",
    color: "",
    peso: "",
    edad: "",
    vacunas: "",
    foto: ""
  });

  const [imagePreview, setImagePreview] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [loadingMascota, setLoadingMascota] = useState(true);

  const cargarMascota = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const user =
        storedUser && storedUser !== "undefined"
          ? JSON.parse(storedUser)
          : null;

      if (!user?.id) {
        setLoadingMascota(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/pets/user/${user.id}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        const mascota = data.find((m) => String(m.id) === String(id));

        if (mascota) {
          setForm({
            nombre: mascota.nombre || "",
            tipo: mascota.tipo || "",
            raza: mascota.raza || "",
            color: mascota.color || "",
            peso: mascota.peso || "",
            edad: mascota.edad || "",
            vacunas: mascota.vacunas || "",
            foto: mascota.foto || ""
          });

          setImagePreview(mascota.foto || "");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Error cargando la mascota");
    } finally {
      setLoadingMascota(false);
    }
  };

  useEffect(() => {
    cargarMascota();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        foto: reader.result
      }));
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (guardando) return;
    setGuardando(true);

    try {
      const res = await fetch(`${API_URL}/api/pets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: form.nombre,
          tipo: form.tipo,
          raza: form.raza,
          color: form.color,
          peso: Number(form.peso),
          edad: Number(form.edad),
          vacunas: form.vacunas,
          foto: form.foto
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Mascota actualizada correctamente");
        navigate("/pet/mascotas");
      } else {
        alert(data.error || "Error actualizando mascota");
        setGuardando(false);
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
      setGuardando(false);
    }
  };

  return (
    <>
      {loadingMascota && <LoadingModal text="Cargando mascota..." />}

      <PetOwnerLayout
        title="Editar Mascota"
        subtitle="Actualiza la información de tu peludo"
      >
        <div className="pet-card">
          <PetForm
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleImageChange={handleImageChange}
            imagePreview={imagePreview}
            buttonText={guardando ? "Guardando..." : "Guardar cambios"}
            disabled={guardando}
          />
        </div>
      </PetOwnerLayout>
    </>
  );
}

export default PetEditarMascota;