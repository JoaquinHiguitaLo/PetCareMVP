import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess, showWarning } from "./utils/alerts";
import "./App.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/request-reset-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        await showSuccess(
          "Código enviado",
          "Revisa tu correo e ingresa el código de verificación"
        );
        setStep(2);
      } else {
        showError("Error", data.error || "No se pudo enviar el código");
      }
    } catch (error) {
      console.error(error);
      showError("Error", "Error conectando con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (nuevaPassword !== confirmPassword) {
      showWarning("Contraseñas diferentes", "Las contraseñas no coinciden");
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
          codigo,
          nuevaPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        await showSuccess(
          "Contraseña actualizada",
          "Tu contraseña se actualizó correctamente"
        );
        navigate("/");
      } else {
        showError("Error", data.error || "Error restableciendo contraseña");
      }
    } catch (error) {
      console.error(error);
      showError("Error", "Error conectando con el servidor");
    } finally {
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
          {step === 1
            ? "Ingresa tu correo para recibir un código"
            : "Ingresa el código y define una nueva contraseña"}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="login-form">
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

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? "Enviando código..." : "Enviar código"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="login-form">
            <div className="login-input-group">
              <span className="login-input-icon">✉️</span>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                readOnly
              />
            </div>

            <div className="login-input-group">
              <span className="login-input-icon">🔢</span>
              <input
                type="text"
                placeholder="Código de verificación"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                maxLength={6}
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

            <button
              type="button"
              className="dashboard-button"
              style={{ background: "#6b7280" }}
              onClick={() => {
                setStep(1);
                setCodigo("");
                setNuevaPassword("");
                setConfirmPassword("");
              }}
            >
              Volver
            </button>
          </form>
        )}

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