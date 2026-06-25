import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import QuizStandalone from './pages/QuizStandalone.jsx'
import VideoPage from './pages/VideoPage.jsx'

const path = window.location.pathname
const root = createRoot(document.getElementById('root'))

let Page = <App />
if (path === '/quiz') Page = <QuizStandalone />
if (path === '/video') Page = <VideoPage />

root.render(
  <StrictMode>
    {Page}
  </StrictMode>
)
