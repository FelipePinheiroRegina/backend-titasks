import multer from 'multer'
import uploadConfig from '../configs/upload'
const upload = multer(uploadConfig.MULTER)

import { Router } from 'express'
export const tasksRoutes = Router() // exporta a rota para o index

import { TasksController } from '../controllers/TasksController'
const tasksController =  new TasksController()

import { ensureAuth } from '../middlewares/ensureAuth'
tasksRoutes.use(ensureAuth)

tasksRoutes.post('/', upload.single('image'), tasksController.create)

tasksRoutes.get('/:id', tasksController.show)

tasksRoutes.get('/', tasksController.index)

tasksRoutes.put('/:id', tasksController.update)

tasksRoutes.patch('/:task_id', tasksController.updateStatus)

tasksRoutes.delete('/:id', tasksController.delete)

