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
    <section className="card">
      <h2>Solicitar restablecimiento</h2>
      <p>Ingresa el correo asociado y te enviaremos un enlace para restablecer tu contraseña.</p>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Tipo
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="usuario">Usuario</option>
            <option value="tienda">Tienda</option>
          </select>
        </label>

        <label>
          Correo
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@correo.com"
          />
        </label>

        <div className="row">
          <button className="btn" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Enviando...' : 'Solicitar enlace'}
          </button>
        </div>
      </form>

      {status === 'sent' && <p className="success">Si el correo existe, recibirás un enlace.</p>}
      {status === 'error' && <p className="error">Ocurrió un error. Intenta nuevamente.</p>}
    </section>
  )
}

export default RequestReset
