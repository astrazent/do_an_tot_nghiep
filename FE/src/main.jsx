import React from 'react'
import { BrowserRouter } from 'react-router-dom' // Giữ nguyên BrowserRouter
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { persistor, store } from './Redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import '~/index.css'
import { AuthProvider } from './contexts/authContext'
import { AlertProvider } from './contexts/AlertContext'
import ScrollPageToTop from './components/shared/ScrollPageToTop'

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AuthProvider>
                    <AlertProvider>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </AlertProvider>
                </AuthProvider>
            </PersistGate>
        </Provider>
    </React.StrictMode>
)
