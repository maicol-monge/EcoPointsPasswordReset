# 🔧 Configuración del Backend para EcoPoints Password Reset

## ⚠️ Ajuste necesario en el controlador

Tu backend está casi perfecto, pero hay un pequeño ajuste necesario en la URL del enlace:

### Cambio requerido en `passwordResetController.js`

```javascript
// ❌ ANTES (línea ~38):
const enlace = `${base.replace(/\/$/, "")}/reset?token=${encodeURIComponent(
  token
)}&tipo=${encodeURIComponent(t)}`;

// ✅ DESPUÉS:
const enlace = `${base.replace(/\/$/, "")}/?token=${encodeURIComponent(
  token
)}&tipo=${encodeURIComponent(t)}`;
```

**Razón**: El frontend está configurado para leer el token desde la URL raíz (`/?token=...`) no desde `/reset?token=...`.

## 🌐 Variables de entorno requeridas

### En tu backend (.env):

```env
# URL pública del frontend desplegado en Render
FRONTEND_BASE_URL=https://ecopointspasswordreset.onrender.com

# Configuración de correo (una de las dos opciones):

# Opción 1: SMTP personalizado
SMTP_HOST=smtp.tu-proveedor.com
SMTP_PORT=587
SMTP_USER=tu_usuario
SMTP_PASS=tu_password
EMAIL_FROM="EcoPoints <no-reply@tu-dominio.com>"

# Opción 2: Gmail (más simple)
EMAIL_USER=eco.points.mobile.app@gmail.com
EMAIL_PASS=tu-app-password-gmail
EMAIL_FROM="EcoPoints <eco.points.mobile.app@gmail.com>"
```

### En tu frontend (Render):

```env
# URL del backend desplegado
VITE_API_BASE=https://ecopointsapi.onrender.com
```

## 🔄 Flujo completo integrado

### 1. Desde la app móvil:

```javascript
// POST https://ecopointsapi.onrender.com/api/password/solicitar
{
  "tipo": "usuario", // o "tienda"
  "correo": "usuario@ejemplo.com"
}
```

### 2. El backend:

- Genera token seguro
- Guarda en base de datos con expiración (1 hora)
- Envía correo con enlace: `https://ecopointspasswordreset.onrender.com/?token=ABC123&tipo=usuario`

### 3. El usuario:

- Recibe correo
- Hace clic en enlace
- Ve formulario de nueva contraseña
- Confirma y guarda

### 4. El frontend:

- Valida token: `GET /api/password/validar/ABC123`
- Confirma nueva contraseña: `POST /api/password/confirmar/ABC123`

## ✅ Verificación de integración

Para probar que todo funciona:

1. **Prueba la validación de token**:

   ```bash
   curl "https://ecopointsapi.onrender.com/api/password/validar/token-de-prueba"
   ```

2. **Prueba el restablecimiento**:

   ```bash
   curl -X POST "https://ecopointsapi.onrender.com/api/password/confirmar/token-de-prueba" \
     -H "Content-Type: application/json" \
     -d '{"password_nueva": "nuevaPassword123"}'
   ```

3. **Revisa los logs del backend** para ver si los correos se envían correctamente.

## 🐛 Troubleshooting común

### Error: "Token no encontrado"

- Verificar que el token se está generando y guardando en la DB
- Revisar que la URL del enlace sea correcta

### Error: "CORS"

- Asegurar que el backend permite requests desde `https://ecopointspasswordreset.onrender.com`
- Tu configuración CORS ya está bien, permite todos los orígenes

### Error: "No se envía correo"

- Verificar variables de entorno de email
- Revisar logs del backend para errores de SMTP

### Error: "Network error"

- Verificar que `VITE_API_BASE` está configurado en Render
- Confirmar que el backend está activo en `https://ecopointsapi.onrender.com`

## 📝 Estado actual

✅ **Backend**: Controladores y rutas correctas  
✅ **Frontend**: Integración con API completa  
⚠️ **Ajuste menor**: Cambiar `/reset?` por `/?` en el enlace del correo  
✅ **Seguridad**: Tokens con expiración, validación, hash bcrypt  
✅ **UX**: Flujo directo desde correo a formulario de cambio
