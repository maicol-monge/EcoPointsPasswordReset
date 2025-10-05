import React from 'react'
import logoUrl from './assets/logo_no_bg.png'

import RequestReset from './pages/RequestReset'
import ResetPassword from './pages/ResetPassword'


function App() {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  return (
    <div className="container">
      <header className="header">
        <div className="logo-section">
          <img src={logoUrl} alt="EcoPoints" className="logo" />
          <div className="brand">
            <h1>EcoPoints</h1>
            <p className="subtitle">Restablecimiento de contraseña</p>
          </div>
        </div>
      </header>
      <main className="main-content">
        {!token ? <RequestReset /> : <ResetPassword token={token} />}
      </main>
      <footer className="footer">
        <p>© 2025 EcoPoints. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default App
