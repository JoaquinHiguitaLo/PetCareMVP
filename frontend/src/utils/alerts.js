import Swal from "sweetalert2";

export const showSuccess = (title, text = "") =>
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#a100ff"
  });

export const showError = (title, text = "") =>
  Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#a100ff"
  });

export const showWarning = (title, text = "") =>
  Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: "#a100ff"
  });

export const showInfo = (title, text = "") =>
  Swal.fire({
    icon: "info",
    title,
    text,
    confirmButtonColor: "#a100ff"
  });

export const showConfirm = (title, text = "") =>
  Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#a100ff",
    cancelButtonColor: "#6b7280"
  });