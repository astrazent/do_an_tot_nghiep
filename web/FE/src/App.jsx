import { useRoutes } from 'react-router-dom'
import { routes } from './routes'
import GlobalSSEHandler from '~/components/shared/GlobalSSEHandler'

function App() {
    const route = useRoutes(routes)
    return (
        <>
            <GlobalSSEHandler />
            {route}
        </>
    )
}

export default App
