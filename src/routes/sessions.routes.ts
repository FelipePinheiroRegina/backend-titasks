import { Router } from 'express'
export const sessionsRoutes = Router()

import { SessionController } from '../controllers/SessionController'
const sessionController = new SessionController()

sessionsRoutes.post('/', sessionController.create)
