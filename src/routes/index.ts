import { usersRoutes } from './users.routes'
import { sessionsRoutes } from './sessions.routes'
import { tasksRoutes } from './tasks.routes'
import { answersRoutes } from './answers.routes'


import { Router } from 'express'
export const routes = Router() // exporta todas as rotas para server

routes.use('/sessions', sessionsRoutes)
routes.use('/users',    usersRoutes)
routes.use('/tasks',    tasksRoutes)
routes.use('/answers',  answersRoutes)

