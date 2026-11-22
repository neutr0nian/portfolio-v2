import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/belanosima/latin-400.css'
import '@fontsource/belanosima/latin-600.css'
import '@fontsource/abhaya-libre/latin-400.css'
import '@fontsource/abhaya-libre/latin-600.css'
import '@fontsource/abhaya-libre/latin-700.css'
import './index.scss'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
