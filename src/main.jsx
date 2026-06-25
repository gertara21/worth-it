import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import QuizStandalone from './pages/QuizStandalone.jsx'

const path = window.location.pathname
const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    {path === '/quiz' ? <QuizStandalone /> : <App />}
  </StrictMode>
)
