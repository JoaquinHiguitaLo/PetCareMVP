import "../petOwner.css";

function LoadingModal({ text = "Cargando..." }) {
  return (
    <div className="loading-overlay">
      <div className="loading-modal">
        <div className="loading-spinner"></div>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default LoadingModal;