const userRoutes = require('./user.routes')
const tasksRoutes = require('./tasks.routes')
const sessionRoutes = require('./session.routes')
const answerRoutes = require("./answer.routes")
const documentationsRoutes = require('./documentations.routes')
const stepsRoutes = require('./steps.routes')
const schedulesRoutes = require('./schedules.routes')

const { Router } = require('express')
const routes = Router()

routes.use('/session', sessionRoutes)
routes.use('/user', userRoutes)
routes.use('/tasks', tasksRoutes)
routes.use('/answer', answerRoutes)
routes.use('/documentations', documentationsRoutes)
routes.use('/steps', stepsRoutes)
routes.use('/schedules', schedulesRoutes)

module.exports = routes