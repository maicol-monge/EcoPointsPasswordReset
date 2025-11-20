import React from 'react'

function NoTokenPage() {
  return (
    <section className="card no-token-card">
      <div className="card-intro">
        <h2>🔗 Enlace requerido</h2>
        <p>Esta página se accede únicamente desde el enlace seguro enviado a tu correo electrónico.</p>
      </div>
      
      <div className="instructions">
        <div className="step">
          <span className="step-number">1</span>
          <div className="step-content">
            <h3>Solicita el restablecimiento</h3>
            <p>Desde la app Waylo selecciona "¿Olvidaste tu contraseña?" e ingresa tu correo electrónico.</p>
          </div>
        </div>
        
        <div className="step">
          <span className="step-number">2</span>
          <div className="step-content">
            <h3>Revisa tu correo</h3>
            <p>Waylo te enviará un correo con un enlace seguro para restablecer tu contraseña.</p>
          </div>
        </div>
        
        <div className="step">
          <span className="step-number">3</span>
          <div className="step-content">
            <h3>Haz clic en el enlace</h3>
            <p>Al hacerlo llegarás aquí y podrás establecer tu nueva contraseña.</p>
          </div>
        </div>
      </div>

      <div className="help-section">
        <div className="help-box">
          <h4>💡 ¿No recibiste el correo?</h4>
          <ul>
            <li>Revisa tu carpeta de spam o correo no deseado</li>
            <li>Verifica que ingresaste correctamente tu dirección de correo</li>
            <li>El enlace expira después de 1 hora por seguridad</li>
            <li>Puedes solicitar un nuevo enlace desde la app Waylo</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default NoTokenPage