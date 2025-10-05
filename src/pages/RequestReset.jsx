import React, { useState } from 'react'

function RequestReset() {
  const [email, setEmail] = useState('')
  const [tipo, setTipo] = useState('usuario')
  const [status, setStatus] = useState(null)

  const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await fetch(`${apiBase}/api/password/solicitar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, correo: email }),
      })
      setStatus('sent')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <section className="card request-card">
      <div className="card-intro">
        <h2>🔐 Solicitar restablecimiento</h2>
        <p>Ingresa tu correo electrónico y te enviaremos un enlace seguro para restablecer tu contraseña.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label htmlFor="tipo">
            Tipo de cuenta
            <select id="tipo" value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="usuario">👤 Usuario</option>
              <option value="tienda">🏪 Tienda</option>
            </select>
          </label>
        </div>

        <div className="input-group">
          <label htmlFor="email">
            Correo electrónico
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@correo.com"
            />
          </label>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? (
              <>
                <div className="btn-spinner"></div>
                Enviando...
              </>
            ) : (
              <>
                📧 Enviar enlace de restablecimiento
              </>
            )}
          </button>
        </div>
      </form>

      {status === 'sent' && (
        <div className="alert alert-success">
          <span>✅</span> 
          <div>
            <strong>Correo enviado</strong>
            <p>Si el correo existe en nuestro sistema, recibirás un enlace de restablecimiento.</p>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="alert alert-error">
          <span>❌</span>
          <div>
            <strong>Error de conexión</strong>
            <p>No se pudo enviar el correo. Verifica tu conexión e intenta nuevamente.</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default RequestReset
