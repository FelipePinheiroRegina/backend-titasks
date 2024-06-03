require('express-async-errors')
require('dotenv').config()

const express = require('express')
const routes = require('./routes')
const AppError = require('./utils/AppError')
const migrationRun = require('./database/postgres/migration')
const cors = require('cors')
const uploadConfig = require('../src/configs/upload')

migrationRun()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)

app.use((error, req, res, next) => {
    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message
        })
    }

    console.log(error)

    return res.status(500).json({
        status: "error",
        message: "internal error server"
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log('server is running on port', + PORT))
