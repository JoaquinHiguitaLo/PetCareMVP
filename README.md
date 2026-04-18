# 🐾 PetCare MVP

PetCare es una aplicación web para la gestión de servicios orientados al cuidado de mascotas. Permite la interacción entre dueños de mascotas y empresas como veterinarias, guarderías y tiendas del sector.

El sistema centraliza el registro de mascotas, empresas, servicios y citas en una sola plataforma.

---

# 🚀 Tecnologías utilizadas

### Frontend

* React
* Vite
* CSS

### Backend

* Node.js
* Express
* PostgreSQL
* JWT Authentication

---

# 👤 Roles del sistema

## Dueños de mascotas

Pueden:

* Registrar mascotas
* Editar mascotas
* Eliminar mascotas
* Consultar empresas disponibles
* Consultar servicios disponibles
* Agendar citas
* Ver sus citas
* Cancelar citas

## Empresas

Pueden:

* Registrar empresas
* Editar empresas
* Eliminar empresas
* Crear servicios
* Editar servicios
* Eliminar servicios
* Consultar citas recibidas
* Confirmar citas
* Completar citas

---

# 📊 Estados de citas

Las citas pueden tener los siguientes estados:

* pendiente
* confirmada
* cancelada
* completada

---

# 🧠 Validaciones del sistema

El sistema valida que:

* No se registren citas en fechas pasadas
* No se dupliquen citas para la misma mascota
* No se dupliquen citas en la misma empresa y horario
* Las empresas puedan confirmar citas
* Los usuarios puedan cancelar citas

---

# ⚙️ Instalación del proyecto

Clonar repositorio:

```
git clone https://github.com/JoaquinHiguitaLo/PetCareMVP.git
cd PetCareMVP
```

---

# 🔧 Configuración Backend

Entrar al backend:

```
cd backend
npm install
```

Crear archivo `.env`

```
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=petcare
JWT_SECRET=petcare_secret
```

Ejecutar backend:

```
npm run dev
```

---

# 🎨 Configuración Frontend

Entrar al frontend:

```
cd frontend
npm install
```

Crear archivo `.env`

```
VITE_API_URL=http://localhost:3000
```

Ejecutar frontend:

```
npm run dev
```

Abrir en navegador:

```
http://localhost:5173
```

---

# 📁 Arquitectura del proyecto

```
PetCareMVP
│
├── backend
│   ├── controllers
│   ├── services
│   ├── repositories
│   ├── routes
│   └── config
│
├── frontend
│   ├── components
│   ├── pages
│   └── styles
│
└── README.md
```

---

# 🔐 Autenticación

El sistema utiliza:

* JWT
* Middleware por roles
* Redirección automática según tipo de usuario

---

# 📌 Autor

Proyecto desarrollado por:

**Joaquín Higuita**
