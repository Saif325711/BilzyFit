import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SchoolDataProvider } from './context/SchoolDataContext.jsx'
import { ToastProvider } from './components/ToastProvider.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <SchoolDataProvider>
          <App />
        </SchoolDataProvider>
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>,
)


