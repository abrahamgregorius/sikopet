import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { db, seedDatabase } from './database/index.js'

async function initApp() {
  try {
    await db.open();
    console.log('[App] Database opened:', db.name, 'v' + db.verno);
    await seedDatabase();
  } catch (err) {
    console.error('[App] Database initialization failed:', err);
  }
}

initApp();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)