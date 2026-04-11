import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Register() {
  const [form, setForm] = useState({
    nombre: "",
    cedula: "",
    email: "",
    telefono: "",
    password: "",
    rol: "pet_owner"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registro exitoso 🎉");
        navigate("/");
      } else {
        alert(data.error || "Error registrando usuario");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-circle">🐶🐱</div>

        <h1 className="login-title">PetCare</h1>
        <p className="login-subtitle">Crea tu cuenta</p>
        <p className="login-helper">
          Regístrate y comienza a gestionar mejor el cuidado de tus mascotas
        </p>

        <form onSubmit={handleRegister} className="register-form">
          <div className="register-role-row">
            <button
              type="button"
              className={`register-role-btn ${form.rol === "pet_owner" ? "active" : ""}`}
              onClick={() => setForm({ ...form, rol: "pet_owner" })}
            >
              <span className="register-role-icon">👤</span>
              <div>
                <strong>Usuario</strong>
                <small>Dueño de mascota</small>
              </div>
            </button>

            <button
              type="button"
              className={`register-role-btn ${form.rol === "business" ? "active" : ""}`}
              onClick={() => setForm({ ...form, rol: "business" })}
            >
              <span className="register-role-icon">🏢</span>
              <div>
                <strong>Empresa</strong>
                <small>Proveedor de servicios</small>
              </div>
            </button>
          </div>

          <div className="login-input-group">
            <span className="login-input-icon">👤</span>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-input-group">
            <span className="login-input-icon">🪪</span>
            <input
              type="text"
              name="cedula"
              placeholder="Cédula o documento"
              value={form.cedula}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-input-group">
            <span className="login-input-icon">✉️</span>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-input-group">
            <span className="login-input-icon">📞</span>
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-input-group">
            <span className="login-input-icon">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="login-register-text">
          ¿Ya tienes cuenta?{" "}
          <span className="login-register-link" onClick={() => navigate("/")}>
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;