import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user?.rol === "business") {
          navigate("/dashboard");
        } else {
          navigate("/pet/home");
        }
      } else {
        alert(data.error || "Error en login");
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
        <p className="login-subtitle">Cuida a tu mejor amigo</p>

        <p className="login-helper">Inicia sesión para continuar</p>

        <form onSubmit={handleLogin} className="login-form">
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
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="login-forgot-row">
            <span
              className="login-forgot-link"
              onClick={() => navigate("/forgot-password")}
            >
              ¿Olvidaste tu contraseña?
            </span>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="login-register-text">
          ¿No tienes cuenta?{" "}
          <span className="login-register-link" onClick={() => navigate("/register")}>
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;