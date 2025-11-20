import React from 'react'
import logoUrl from './assets/logo_no_bg.png'

import ResetPassword from './pages/ResetPassword'
import NoTokenPage from './pages/NoTokenPage'


function App() {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  
  return (
    <div className="container">
      <header className="header">
        <div className="logo-section">
          <img src={logoUrl} alt="Waylo" className="logo" />
          <div className="brand">
            <h1>Waylo</h1>
            <p className="subtitle">Restablecimiento de contraseña</p>
          </div>
        </div>
      </header>
      <main className="main-content">
        {token ? <ResetPassword token={token} /> : <NoTokenPage />}
      </main>
      <footer className="footer">
        <p>© 2025 Waylo. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default App
