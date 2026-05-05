function ComponenteJuaco() {
  return (
    <div style={{
      background: "white",
      borderRadius: "20px",
      padding: "24px",
      margin: "20px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      fontFamily: "Arial, sans-serif"
    }}>
      <h2>🐾 Aporte de Juaco - PetCare MVP</h2>

      <p>
        Este componente resume el avance del proyecto PetCare, una plataforma web
        para conectar dueños de mascotas con empresas de servicios pet-friendly.
      </p>

      <h3>✅ Funcionalidades actuales</h3>
      <ul>
        <li>Registro e inicio de sesión de usuarios.</li>
        <li>Gestión de mascotas.</li>
        <li>Registro de empresas y servicios.</li>
        <li>Agendamiento y administración de citas.</li>
        <li>Alertas mejoradas con SweetAlert2.</li>
      </ul>

      <h3>🛠️ Tecnologías usadas</h3>
      <p>React, Vite, JavaScript, CSS, Node.js, Express, PostgreSQL y Supabase.</p>

      <h3>🚀 Mejoras futuras</h3>
      <ul>
        <li>Notificaciones automáticas.</li>
        <li>Historial clínico completo.</li>
        <li>Pagos en línea.</li>
        <li>Calificaciones y reseñas de empresas.</li>
      </ul>
    </div>
  );
}

export default ComponenteJuaco;