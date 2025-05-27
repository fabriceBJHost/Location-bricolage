import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/index.css'
import { RouterProvider } from 'react-router-dom'
import Router from './routes/Router.jsx'
import { ContextProvider } from './contexts/AuthCOntext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryclient = new QueryClient()
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <QueryClientProvider client={queryclient}>
        <RouterProvider router={Router} />
      </QueryClientProvider>
    </ContextProvider>
  </StrictMode>
)
