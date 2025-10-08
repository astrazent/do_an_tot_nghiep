import React from 'react'
import { BrowserRouter } from 'react-router-dom' // Giữ nguyên BrowserRouter
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { store } from '~/store'
import '~/index.css'
import { AuthProvider } from './contexts/authContext'
import { AlertProvider } from './contexts/AlertContext'
import ScrollPageToTop from './components/shared/ScrollPageToTop'

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <AuthProvider>
                <AlertProvider>
                    <BrowserRouter>
                        <ScrollPageToTop />
                        <App />
                    </BrowserRouter>
                </AlertProvider>
            </AuthProvider>
        </Provider>
    </React.StrictMode>
)
