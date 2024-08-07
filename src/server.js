require('express-async-errors');
require('dotenv').config();
require('./jobs/checkScheduledAccounts.js');

const express = require('express');
const routes = require('./routes');
const AppError = require('./utils/AppError');
const migrationRun = require('./database/sqlite/migration');
const cors = require('cors');
const uploadConfig = require('../src/configs/upload');

migrationRun();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER));
app.use(routes);

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  console.log(error);

  return res.status(500).json({
    status: "error",
    message: "internal server error"
  });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, '0.0.0.0', () => console.log(`server is running on port ${PORT}`))