const multer = require("multer")
const uploadConfig = require("../configs/upload")
const upload = multer(uploadConfig.MULTER)

const StepsController = require('../controllers/StepsController')
const stepsController = new StepsController()

const { Router } = require('express')
const stepsRoutes = Router()

const ensureAuth = require('../middlewares/ensureAuth')
stepsRoutes.use(ensureAuth)

stepsRoutes.post('/:id', upload.single('media'), stepsController.create)

stepsRoutes.get('/:id', stepsController.index)

module.exports = stepsRoutes