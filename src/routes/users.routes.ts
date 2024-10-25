import multer from 'multer'
import uploadConfig from '../configs/upload'
const upload = multer(uploadConfig.MULTER)

import { Router } from 'express'
export const usersRoutes = Router()


import { UserController } from '../controllers/UserController'
const userController = new UserController()

import { ensureAuth } from '../middlewares/ensureAuth'

import { UserAvatarController } from '../controllers/UserAvatarController'
const userAvatarController = new UserAvatarController()

usersRoutes.post('/', userController.create)

usersRoutes.get('/:id', ensureAuth, userController.index)

usersRoutes.put('/', ensureAuth, userController.update)
usersRoutes.patch('/avatar', ensureAuth, upload.single('avatar'), userAvatarController.update)