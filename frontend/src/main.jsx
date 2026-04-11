import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Dashboard from "./Dashboard.jsx";
import Register from "./Register.jsx";
import MisEmpresas from "./MisEmpresas.jsx";
import MisServicios from "./MisServicios.jsx";
import MisMascotas from "./MisMascotas.jsx";
import MisCitas from "./MisCitas.jsx";
import CitasEmpresa from "./CitasEmpresa.jsx";
import HistoriaClinica from "./HistoriaClinica.jsx";
import PetHome from "./PetHome.jsx";
import PetServicios from "./PetServicios.jsx";
import PetEmpresasCategoria from "./PetEmpresasCategoria.jsx";
import PetServiciosEmpresa from "./PetServiciosEmpresa";
import PetEmpresaDetalle from "./PetEmpresaDetalle.jsx";
import PetMascotas from "./petMascotas.jsx";  
import PetEditarMascota from "./PetEditarMascota.jsx";
import PetCrearMascota from "./PetCrearMascota.jsx";
import PetAgendarCita from "./PetAgendarCita.jsx";
import PetMisCitas from "./PetMisCitas.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import Profile from "./Profile.jsx";
import PetEditarPerfil from "./PetEditarPerfil.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/empresas" element={<MisEmpresas />} />
      <Route path="/dashboard/servicios" element={<MisServicios />} />
      <Route path="/dashboard/mascotas" element={<MisMascotas />} />
      <Route path="/dashboard/citas" element={<MisCitas />} />
      <Route path="/dashboard/citas-empresa" element={<CitasEmpresa />} />
      <Route path="/dashboard/historia-clinica" element={<HistoriaClinica />} />
      <Route path="/pet/home" element={<PetHome />} />
      <Route path="/pet/servicios" element={<PetServicios />} />
      <Route path="/pet/categoria" element={<PetEmpresasCategoria />} />
      <Route path="/pet/empresa/:id/servicios" element={<PetServiciosEmpresa />} />
      <Route path="/pet/empresa/:id" element={<PetEmpresaDetalle />} />
      <Route path="/pet/mascotas" element={<PetMascotas />} />
      <Route path="/pet/editar-mascota/:id" element={<PetEditarMascota />} />
      <Route path="/pet/crear-mascota" element={<PetCrearMascota />} />
      <Route path="/pet/agendar-cita/:servicioId" element={<PetAgendarCita />} />
      <Route path="/pet/mis-citas" element={<PetMisCitas />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/pet/perfil" element={<Profile />} />
      <Route path="/pet/editar-perfil" element={<PetEditarPerfil />} />
    </Routes>
  </BrowserRouter>
);