import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (nuevaPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          nuevaPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Contraseña actualizada correctamente");
        navigate("/");
      } else {
        alert(data.error || "Error restableciendo contraseña");
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
        <div className="login-logo-circle">🔑</div>

        <h1 className="login-title" style={{ fontSize: "2.4rem" }}>
          Restablecer contraseña
        </h1>

        <p className="login-subtitle" style={{ fontSize: "1.1rem" }}>
          Ingresa tu correo y define una nueva contraseña
        </p>

        <form onSubmit={handleResetPassword} className="login-form">
          <div className="login-input-group">
            <span className="login-input-icon">✉️</span>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <span className="login-input-icon">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <span className="login-input-icon">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Actualizando..." : "Guardar nueva contraseña"}
          </button>
        </form>

        <p className="login-register-text">
          ¿Recordaste tu contraseña?{" "}
          <span className="login-register-link" onClick={() => navigate("/")}>
            Volver al login
          </span>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;