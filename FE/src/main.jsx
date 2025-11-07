import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { persistor, store } from './Redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import '~/index.css'
import { AuthProvider } from './contexts/authContext'
import { AlertProvider } from './contexts/AlertContext'
import ScrollPageToTop from './components/shared/ScrollPageToTop'
import { ThemeProvider } from './contexts/ThemeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()
createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {/* <AuthProvider> */}
                    <ThemeProvider>
                        <AlertProvider>
                            <QueryClientProvider client={queryClient}>
                                <BrowserRouter>
                                    <ScrollPageToTop />
                                    <App />
                                </BrowserRouter>
                            </QueryClientProvider>
                        </AlertProvider>
                    </ThemeProvider>
                {/* </AuthProvider> */}
            </PersistGate>
        </Provider>
    </React.StrictMode>
)
