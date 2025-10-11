import React, { useEffect, useState } from 'react'
import logoUrl from '../assets/logo_no_bg.png'

function ResetPassword({ token }) {
  const [valid, setValid] = useState(null)
  const [tipo, setTipo] = useState(null)
  const [idRef, setIdRef] = useState(null)
  const [displayName, setDisplayName] = useState(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState(null)

  const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')

  useEffect(() => {
    async function validate() {
      try {
        const r = await fetch(`${apiBase}/api/password/validar/${encodeURIComponent(token)}`)
        if (!r.ok) {
          console.error('Token validation failed:', r.status, r.statusText)
          setValid(false)
          return
        }
        const json = await r.json()
        if (json.success && json.data) {
            setValid(true)
            const tipoResp = json.data.tipo || null
            const id = json.data.id_referencia || null
            setTipo(tipoResp)
            setIdRef(id)
            console.log('Token validated successfully:', json.data)
            // Try to fetch display name from profile endpoints
            try {
              await fetchProfile(id, tipoResp)
            } catch (pfErr) {
              console.error('Error fetching profile for displayName:', pfErr)
            }
          } else {
          console.error('Token validation failed:', json.message)
          setValid(false)
        }
      } catch (err) {
        console.error('Network error during token validation:', err)
        setValid(false)
      }
    }
    validate()
  }, [token])

  async function fetchProfile(id, tipo) {
    if (!id || !tipo) return
    try {
      const path = tipo === 'usuario' ? `/api/usuarios/perfil/${id}` : `/api/tiendas/${id}`
      const r = await fetch((apiBase || '') + path)
      if (!r.ok) {
        console.warn('Profile fetch returned non-ok:', r.status)
        return
      }
      const pj = await r.json()
      const data = pj.data || pj
      if (!data) return
      let name = null
      if (tipo === 'usuario') {
        // try common fields
        name = [data.nombre, data.apellido].filter(Boolean).join(' ')
        if (!name) name = data.nombre || data.full_name || data.correo || null
      } else {
        name = data.nombre || data.razon_social || data.nombre_tienda || null
      }
      if (name) setDisplayName(name)
    } catch (err) {
      console.error('Error fetching profile:', err)
    }
  }

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
      
      const json = await r.json()
      
      if (r.ok && json.success) {
        console.log('Password reset successful:', json.message)
        setStatus('done')
      } else {
        console.error('Password reset failed:', json.message || 'Unknown error')
        setStatus('error')
      }
    } catch (err) {
      console.error('Network error during password reset:', err)
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
          <h2>🔐 Nueva contraseña</h2>
          <div className="user-info">
            <span className="user-type">{tipo}</span>
            {displayName ? (
              <span className="user-id">{displayName}</span>
            ) : (
              idRef && <span className="user-id">ID: {idRef}</span>
            )}
          </div>
        </div>
      </div>

      <div className="reset-intro">
        <p>Por tu seguridad, estableceremos una nueva contraseña para tu cuenta. Asegúrate de usar una contraseña segura que no hayas usado antes.</p>
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
              autoFocus
            />
          </label>
          <div className="password-requirements">
            <small className={password.length >= 8 ? 'requirement-met' : 'requirement-pending'}>
              ✓ Mínimo 8 caracteres
            </small>
          </div>
        </div>
        
        <div className="input-group">
          <label htmlFor="confirm">
            Confirmar contraseña
            <input 
              id="confirm"
              type="password" 
              value={confirm} 
              onChange={e => setConfirm(e.target.value)} 
              required 
              placeholder="Repite tu nueva contraseña"
            />
          </label>
          {confirm && (
            <div className="password-requirements">
              <small className={password === confirm ? 'requirement-met' : 'requirement-pending'}>
                {password === confirm ? '✓ Las contraseñas coinciden' : '⚠ Las contraseñas no coinciden'}
              </small>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? (
              <>
                <div className="btn-spinner"></div>
                Guardando nueva contraseña...
              </>
            ) : (
              <>
                🔒 Guardar nueva contraseña
              </>
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
          <span>✅</span> 
          <div>
            <strong>¡Contraseña actualizada!</strong>
            <p>Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión en la aplicación con tu nueva contraseña.</p>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="alert alert-error">
          <span>❌</span> 
          <div>
            <strong>Error al actualizar</strong>
            <p>No se pudo cambiar la contraseña. Verifica tu conexión e intenta nuevamente, o solicita un nuevo enlace.</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default ResetPassword
