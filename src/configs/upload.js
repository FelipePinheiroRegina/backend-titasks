const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const fileFilter = (req, file, callback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/avi',
    'video/mkv',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error('Tipo de arquivo inválido.'));
  }
};

const storage = multer.diskStorage({
  destination: TMP_FOLDER,
  filename(request, file, callback) {
    const fileHash = crypto.randomBytes(10).toString('hex');
    const fileName = `${fileHash}-${file.originalname}`;
    return callback(null, fileName);
  },
});

const MULTER = {
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limite de tamanho do arquivo (ajuste conforme necessário)
};

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
};
