import React, { useEffect, useState } from 'react'

function ResetPassword({ token }) {
  const [valid, setValid] = useState(null)
  const [tipo, setTipo] = useState(null)
  const [idRef, setIdRef] = useState(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState(null)

  useEffect(() => {
    async function validate() {
      try {
        const r = await fetch(`/api/password/validar/${encodeURIComponent(token)}`)
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
      const r = await fetch(`/api/password/confirmar/${encodeURIComponent(token)}`, {
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

  if (valid === null) return <p className="card">Validando token...</p>
  if (!valid) return <p className="card error">Token inválido o expirado.</p>

  return (
    <section className="card">
      <h2>Restablecer contraseña</h2>
      <p>Tipo: {tipo} {idRef ? `• id ${idRef}` : ''}</p>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Nueva contraseña
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <label>
          Repetir contraseña
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
        </label>

        <div className="row">
          <button className="btn" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Enviando...' : 'Confirmar nueva contraseña'}
          </button>
        </div>
      </form>

      {status === 'too_short' && <p className="error">La contraseña debe tener al menos 8 caracteres.</p>}
      {status === 'mismatch' && <p className="error">Las contraseñas no coinciden.</p>}
      {status === 'done' && <p className="success">Contraseña actualizada. Puedes cerrar esta ventana.</p>}
      {status === 'error' && <p className="error">Ocurrió un error al actualizar la contraseña.</p>}
    </section>
  )
}

export default ResetPassword
