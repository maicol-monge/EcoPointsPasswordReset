import React from 'react'

import RequestReset from './pages/RequestReset'
import ResetPassword from './pages/ResetPassword'

function App() {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  return (
    <div className="container">
      <header className="header">
        <h1>EcoPoints</h1>
      </header>
      <main>
        {!token ? <RequestReset /> : <ResetPassword token={token} />}
      </main>
      <footer className="footer">© EcoPoints</footer>
    </div>
  )
}

export default App
