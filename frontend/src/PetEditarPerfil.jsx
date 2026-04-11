import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PetOwnerLayout from "./components/PetOwnerLayout";
import LoadingModal from "./components/LoadingModal";
import "./petOwner.css";

function PetEditarPerfil() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const storedUserRaw = localStorage.getItem("user");
  const storedUser =
    storedUserRaw && storedUserRaw !== "undefined"
      ? JSON.parse(storedUserRaw)
      : null;

  const [nombre, setNombre] = useState(storedUser?.nombre || "");
  const [telefono, setTelefono] = useState(storedUser?.telefono || "");
  const [guardando, setGuardando] = useState(false);

  const guardarCambios = async () => {
    if (!storedUser?.id) {
      alert("No hay usuario activo");
      return;
    }

    if (guardando) return;
    setGuardando(true);

    try {
      const res = await fetch(`${API_URL}/api/users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: storedUser.id,
          nombre,
          telefono
        })
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = {
          ...storedUser,
          nombre,
          telefono
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("Perfil actualizado correctamente");
        navigate("/pet/perfil");
      } else {
        alert(data.error || "Error actualizando perfil");
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      {guardando && <LoadingModal text="Guardando cambios..." />}

      <PetOwnerLayout title="Editar perfil" subtitle="Actualiza tu información">
        <div className="pet-card">
          <div className="pet-profile-field">
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="pet-profile-input"
              placeholder="Nombre"
            />
          </div>

          <div className="pet-profile-field">
            <label>Correo</label>
            <input
              type="text"
              value={storedUser?.email || ""}
              disabled
              className="pet-profile-input"
            />
          </div>

          <div className="pet-profile-field">
            <label>Teléfono</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="pet-profile-input"
              placeholder="Teléfono"
            />
          </div>

          <button
            className="pet-primary-button"
            onClick={guardarCambios}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </PetOwnerLayout>
    </>
  );
}

export default PetEditarPerfil;