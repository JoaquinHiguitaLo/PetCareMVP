#PetCare 🐾

PetCare es una aplicación web desarrollada para gestionar servicios orientados al cuidado de mascotas, permitiendo la interacción entre dueños de mascotas y empresas como veterinarias, guarderías y otros negocios del sector.

El sistema permite registrar mascotas, empresas, servicios y agendar citas desde una misma plataforma.

Tecnologías utilizadas

Frontend:

React + Vite
CSS

Backend:

Node.js
Express
PostgreSQL
Funcionalidades actuales
Autenticación
Registro de usuarios (Dueños y Empresas)
Inicio de sesión
Redirección según el rol
Edición de perfil
Vista de recuperación de contraseña
Dueños de mascotas

Los usuarios pueden:

Registrar mascotas
Editar mascotas
Eliminar mascotas
Consultar empresas disponibles
Consultar servicios disponibles
Agendar citas
Ver sus citas
Cancelar citas
Empresas

Las empresas pueden:

Registrar negocios
Editar negocios
Eliminar negocios
Crear servicios
Editar servicios
Eliminar servicios
Consultar citas recibidas
Confirmar citas
Módulo de citas

El sistema valida que:

No se puedan registrar citas en fechas pasadas
No se puedan duplicar citas para la misma mascota
No se puedan duplicar citas en la misma empresa y horario
Las empresas puedan confirmar citas
Los usuarios puedan cancelar citas

Estados disponibles:

pendiente
confirmada
cancelada
Instalación del proyecto

Clonar repositorio:
git clone https://github.com/JoaquinHiguitaLo/petcare-app.git
cd petcare-app

Instalar backend:
cd backend
npm install
npm run dev

Instalar frontend:
cd frontend
npm install
npm run dev

Abrir en el navegador:
http://localhost:5173