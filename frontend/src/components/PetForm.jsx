import { useRef } from "react";
import "../petOwner.css";

function PetForm({
  form,
  handleChange,
  handleSubmit,
  buttonText,
  handleImageChange,
  imagePreview,
  disabled = false
}) {
  const fileInputRef = useRef(null);

  return (
    <form onSubmit={handleSubmit} className="pet-form-wrapper">
      <div className="pet-form-card">
        <h3>Foto de la mascota</h3>

        <div
          className="pet-upload-box"
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview mascota"
              className="pet-upload-preview"
            />
          ) : (
            <div className="pet-upload-placeholder">
              <div className="pet-upload-icon">📷</div>
              <p>Toca para seleccionar una foto</p>
              <span>o subir desde galería</span>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="pet-form-card">
        <h3>Información Básica</h3>

        <label>Nombre *</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Ej: Max"
          required
        />

        <label>Tipo *</label>
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar</option>
          <option value="Canino">🐕 Perro</option>
          <option value="Felino">🐈 Gato</option>
          <option value="Ave">🐦 Ave</option>
          <option value="Otro">Otro</option>
        </select>

        <label>Raza *</label>
        <input
          name="raza"
          value={form.raza}
          onChange={handleChange}
          placeholder="Ej: Golden Retriever"
          required
        />

        <label>Color</label>
        <input
          name="color"
          value={form.color}
          onChange={handleChange}
          placeholder="Ej: Blanco"
        />

        <label>Peso (kg)</label>
        <input
          name="peso"
          value={form.peso}
          onChange={handleChange}
          type="number"
        />

        <label>Edad (años)</label>
        <input
          name="edad"
          value={form.edad}
          onChange={handleChange}
          type="number"
        />

        <label>Vacunas</label>
        <input
          name="vacunas"
          value={form.vacunas}
          onChange={handleChange}
          placeholder="Ej: Rabia"
        />

        <div className="pet-form-submit">
          <button
            type="submit"
            className="pet-primary-button"
            disabled={disabled}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PetForm;