const userRoutes = require('./user.routes')
const tasksRoutes = require('./tasks.router')
const sessionRoutes = require('./session.routes')
const answerRoutes = require("./answer.router")

const { Router } = require('express')
const routes = Router()

routes.use('/session', sessionRoutes)
routes.use('/user', userRoutes)
routes.use('/tasks', tasksRoutes)
routes.use('/answer', answerRoutes)

module.exports = routes