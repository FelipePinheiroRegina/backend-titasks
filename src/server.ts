import { env } from './env/index'
import { routes } from './routes'

import express from 'express'
import cors from 'cors'
import uploadConfig from './configs/upload'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))
app.use(routes)

const PORT = env.SERVER_PORT || 3333
app.listen(PORT, '0.0.0.0', () => console.log('🟢 Server running', PORT))
