const multer = require("multer")
const uploadConfig = require("../configs/upload")
const upload = multer(uploadConfig.MULTER)

const { Router } = require("express")
const tasksRoutes = Router()

const TasksController = require('../controllers/TasksController')
const tasksController =  new TasksController()

const ensureAuth = require("../middlewares/ensureAuth")
tasksRoutes.use(ensureAuth)

tasksRoutes.post('/image', upload.single("image"), tasksController.create)

tasksRoutes.get('/:id', tasksController.show)

tasksRoutes.get('/', tasksController.index)

tasksRoutes.put('/:id', tasksController.update)

tasksRoutes.delete('/:id', tasksController.delete)

module.exports = tasksRoutes