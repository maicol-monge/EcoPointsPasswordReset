import React, { useEffect, useState } from 'react'
import logoUrl from '../assets/logo_no_bg.png'

function ResetPassword({ token }) {
  const [valid, setValid] = useState(null)
  const [tipo, setTipo] = useState(null)
  const [idRef, setIdRef] = useState(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState(null)

  const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')

  useEffect(() => {
    async function validate() {
      try {
        const r = await fetch(`${apiBase}/api/password/validar/${encodeURIComponent(token)}`)
        if (!r.ok) {
          setValid(false)
          return
        }
        const json = await r.json()
        setValid(true)
        setTipo(json.data?.tipo || null)
        setIdRef(json.data?.id_referencia || null)
      } catch (err) {
        console.error(err)
        setValid(false)
      }
    }
    validate()
  }, [token])

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 8) {
      setStatus('too_short')
      return
    }
    if (password !== confirm) {
      setStatus('mismatch')
      return
    }
    setStatus('sending')
    try {
      const r = await fetch(`${apiBase}/api/password/confirmar/${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password_nueva: password }),
      })
      if (r.ok) setStatus('done')
      else setStatus('error')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (valid === null) {
    return (
      <div className="card">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Validando token...</p>
        </div>
      </div>
    )
  }
  
  if (!valid) {
    return (
      <div className="card error-card">
        <div className="error-state">
          <h2>⚠️ Token inválido</h2>
          <p>El enlace de restablecimiento ha expirado o no es válido.</p>
          <p>Por favor, solicita un nuevo enlace de restablecimiento.</p>
        </div>
      </div>
    )
  }

  return (
    <section className="card reset-card">
      <div className="card-header">
        <img src={logoUrl} alt="EcoPoints" className="card-logo" />
        <div>
          <h2>Nueva contraseña</h2>
          <div className="user-info">
            <span className="user-type">{tipo}</span>
            {idRef && <span className="user-id">ID: {idRef}</span>}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label htmlFor="password">
            Nueva contraseña
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="Mínimo 8 caracteres"
            />
          </label>
        </div>
        
        <div className="input-group">
          <label htmlFor="confirm">
            Repetir contraseña
            <input 
              id="confirm"
              type="password" 
              value={confirm} 
              onChange={e => setConfirm(e.target.value)} 
              required 
              placeholder="Confirma tu nueva contraseña"
            />
          </label>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? (
              <>
                <div className="btn-spinner"></div>
                Actualizando...
              </>
            ) : (
              'Confirmar nueva contraseña'
            )}
          </button>
        </div>
      </form>

      {status === 'too_short' && (
        <div className="alert alert-error">
          <span>📏</span> La contraseña debe tener al menos 8 caracteres.
        </div>
      )}
      {status === 'mismatch' && (
        <div className="alert alert-error">
          <span>🔄</span> Las contraseñas no coinciden.
        </div>
      )}
      {status === 'done' && (
        <div className="alert alert-success">
          <span>✅</span> Contraseña actualizada correctamente. Puedes cerrar esta ventana.
        </div>
      )}
      {status === 'error' && (
        <div className="alert alert-error">
          <span>❌</span> Ocurrió un error al actualizar la contraseña. Intenta nuevamente.
        </div>
      )}
    </section>
  )
}

export default ResetPassword
