import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { persistor, store } from './Redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import '~/index.css'
import { AlertProvider } from './contexts/AlertContext'
import ScrollPageToTop from './components/shared/ScrollPageToTop'
import { ThemeProvider } from './contexts/ThemeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { SSEProvider } from './contexts/SSEContext'
const queryClient = new QueryClient()
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <ThemeProvider>
                        <AlertProvider>
                            <QueryClientProvider client={queryClient}>
                                <SSEProvider>
                                    <BrowserRouter>
                                        <ScrollPageToTop />
                                        <App />
                                    </BrowserRouter>
                                </SSEProvider>
                            </QueryClientProvider>
                        </AlertProvider>
                    </ThemeProvider>
                </GoogleOAuthProvider>
            </PersistGate>
        </Provider>
    </React.StrictMode>
)
