const multer = require("multer")
const uploadConfig = require("../configs/upload")
const upload = multer(uploadConfig.MULTER)

const { Router } = require("express")
const documentationsRoutes = Router()

const DocumentationsController = require('../controllers/DocumentationsController')
const documentationController = new DocumentationsController()

const ensureAuth = require('../middlewares/ensureAuth')
documentationsRoutes.use(ensureAuth)

documentationsRoutes.post('/', upload.single('media'),
documentationController.create)

documentationsRoutes.get('/', documentationController.index)
documentationsRoutes.get('/:id', documentationController.show)

module.exports = documentationsRoutes