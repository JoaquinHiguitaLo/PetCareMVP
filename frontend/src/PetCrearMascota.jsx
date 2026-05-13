import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PetOwnerLayout from "./components/PetOwnerLayout";
import PetForm from "./components/PetForm";
import "./petOwner.css";
import { showError, showSuccess } from "./utils/alerts";

function PetCrearMascota() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;

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
      if (!user?.id) {
        showError("No hay usuario activo");
        return;
      }

      const res = await fetch(`${API_URL}/api/pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.id,
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
        showSuccess("Mascota registrada correctamente");
        navigate("/pet/mascotas");
      } else {
        showError(data.error || "Error registrando mascota");
      }
    } catch (error) {
      console.error(error);
      showError("Error conectando con el servidor");
      setGuardando(false);
    }
  };

  return (
    <PetOwnerLayout
      title="Agregar Mascota"
      subtitle="Registra un nuevo compañero"
    >
      <div className="pet-card">
        <PetForm
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleImageChange={handleImageChange}
          imagePreview={imagePreview}
          buttonText="Guardar mascota"
        />
      </div>
    </PetOwnerLayout>
  );
}

export default PetCrearMascota;