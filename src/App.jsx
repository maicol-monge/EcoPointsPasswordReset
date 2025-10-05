import React from 'react'

import RequestReset from './pages/RequestReset'
import ResetPassword from './pages/ResetPassword'


function App() {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  return (
    <div className="container">
      <header className="header">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <img src="/src/assets/logo_no_bg.png" alt="EcoPoints" style={{height:40}} />
          <h1>EcoPoints</h1>
        </div>
      </header>
      <main>
        {!token ? <RequestReset /> : <ResetPassword token={token} />}
      </main>
      <footer className="footer">© EcoPoints</footer>
    </div>
  )
}

export default App
