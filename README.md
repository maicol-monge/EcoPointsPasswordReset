# EcoPoints - Password Reset Frontend

Pequeña SPA React (Vite) para manejar restablecimiento de contraseña usando el backend descrito.

Características:

- Página para solicitar enlace por correo (POST /api/password/solicitar)
- Página /reset?token=... valida token (GET /api/password/validar/:token) y confirma nueva contraseña (POST /api/password/confirmar/:token)

Desarrollo:

1. Instalar dependencias

```powershell
npm install
```

2. Levantar en desarrollo

```powershell
npm run dev
```

Build para producción

```powershell
npm run build
```

Despliegue en Render

- Crea un nuevo Web Service en Render apuntando al repo.
- Build command: npm run build
- Start command: npm run preview (o usa la opción "Static Site" y sirve la carpeta "dist")
- Asegúrate de configurar la variable de entorno FRONTEND_BASE_URL con la URL de Render para que el backend la use al enviar correos.
- Para apuntar al backend externo (ej. https://ecopointsapi.onrender.com) configura la variable de entorno VITE_API_BASE en el servicio de Render.
  - Ejemplo: VITE_API_BASE=https://ecopointsapi.onrender.com
- FRONTEND_BASE_URL se usa por el backend para construir los enlaces en los correos; pon aquí la URL pública que Render asigne a este sitio.
