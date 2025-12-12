import { userRoutes } from './UserRoutes'
import { adminRoutes } from './AdminRoutes'

export const routes = [...userRoutes, ...adminRoutes]
