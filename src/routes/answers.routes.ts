import multer from 'multer'
import uploadConfig from '../configs/upload'
const upload = multer(uploadConfig.MULTER)

import { Router } from 'express'
export const answersRoutes = Router()

import { AnswerController } from '../controllers/AnswerController'
const answerController = new AnswerController()

import { ensureAuth } from '../middlewares/ensureAuth'
answersRoutes.use(ensureAuth)

answersRoutes.get('/:id', answerController.index)

answersRoutes.post('/:id', upload.single('image'), answerController.create)


