import React, { useState } from 'react'
import logoUrl from '../assets/logo_no_bg.png'
import { resetPasswordRequest } from '../config'

function ResetPassword({ token }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState(null) // null | sending | done | error | too_short | mismatch
  const [apiError, setApiError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setApiError('')
    if (password.length < 8) {
      setStatus('too_short')
      return
    }
    if (password !== confirm) {
      setStatus('mismatch')
      return
    }
    setStatus('sending')
    const res = await resetPasswordRequest({ token, newPassword: password })
    if (res.ok && res.success) {
      setStatus('done')
    } else {
      setStatus('error')
      setApiError(res.message || 'No se pudo procesar el restablecimiento.')
    }
  }

  return (
    <section className="card reset-card">
      <div className="card-header">
        <img src={logoUrl} alt="Waylo" className="card-logo" />
        <div>
          <h2>🔐 Nueva contraseña</h2>
          <div className="user-info">
            <span className="user-type">Token detectado</span>
            <span className="user-id">Código seguro</span>
          </div>
        </div>
      </div>

      <div className="reset-intro">
        <p>Ingresa tu nueva contraseña para tu cuenta Waylo. Debe tener al menos 8 caracteres y será aplicada inmediatamente si el enlace sigue vigente.</p>
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
          <button className="btn btn-primary" type="submit" disabled={status === 'sending' || status === 'done'}>
            {status === 'sending' ? (
              <>
                <div className="btn-spinner"></div>
                Guardando nueva contraseña...
              </>
            ) : (
              <>🔒 Guardar nueva contraseña</>
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
            <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="alert alert-error">
          <span>❌</span>
          <div>
            <strong>Error al actualizar</strong>
            <p>{apiError}</p>
            <p>Si el token expiró, solicita un nuevo enlace desde la app.</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default ResetPassword
