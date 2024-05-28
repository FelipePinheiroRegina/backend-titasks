const multer = require("multer")
const uploadConfig = require("../configs/upload")

const { Router } = require('express')
const userRoutes = Router()

const UserController = require('../controllers/UserController')
const userController = new UserController()

const ensureAuth = require("../middlewares/ensureAuth")
const upload = multer(uploadConfig.MULTER)

const UserAvatarController = require("../controllers/UserAvatarController")
const userAvatarController = new UserAvatarController()

userRoutes.post('/', userController.create)
userRoutes.put('/', ensureAuth, userController.update)
userRoutes.patch('/avatar', ensureAuth, upload.single("avatar"), userAvatarController.update)

module.exports = userRoutes