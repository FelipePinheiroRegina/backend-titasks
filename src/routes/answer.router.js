const multer = require("multer")
const uploadConfig = require("../configs/upload")
const upload = multer(uploadConfig.MULTER)

const { Router } = require('express') 
const answerRoutes = Router()

const AnswerController = require("../controllers/AnswerController")
const answerController = new AnswerController()

const ensureAuth = require("../middlewares/ensureAuth")
answerRoutes.use(ensureAuth)

answerRoutes.get('/:id', answerController.index)

answerRoutes.post('/prints/:id', upload.single("prints"), answerController.create)

module.exports = answerRoutes

