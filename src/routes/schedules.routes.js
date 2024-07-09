const { Router } = require("express")
const schedulesRoutes = Router()

const SchedulesController = require('../controllers/SchedulesController')
const schedulesController = new SchedulesController()

const ensureAuth = require('../middlewares/ensureAuth')
schedulesRoutes.use(ensureAuth)


schedulesRoutes.post('/', schedulesController.create)
schedulesRoutes.get('/', schedulesController.index)
schedulesRoutes.patch('/:id', schedulesController.update)


module.exports = schedulesRoutes