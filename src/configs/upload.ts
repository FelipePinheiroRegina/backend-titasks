import path from 'path'
import multer, { FileFilterCallback } from 'multer'
import crypto from 'crypto'
import { Request } from 'express'

const TMP_FOLDER = path.resolve(__dirname, '..', '..', 'tmp')
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, 'uploads')

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
	const allowedMimes = [
		'image/jpeg',
		'image/pjpeg',
		'image/png',
		'image/gif',
		'video/mp4',
		'video/avi',
		'video/mkv',
	]

	if (allowedMimes.includes(file.mimetype)) {
		callback(null, true)
	} else {
		callback(new Error('Tipo de arquivo inválido.'))
	}
}

const storage = multer.diskStorage({
	destination: TMP_FOLDER,
	filename(request, file, callback) {
		const fileHash = crypto.randomBytes(10).toString('hex')
		const fileName = `${fileHash}-${file.originalname}`
		return callback(null, fileName)
	},
})

const MULTER = {
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 100 * 1024 * 1024 }, // Limite de tamanho do arquivo (ajuste conforme necessário)
}

export default {
	TMP_FOLDER,
	UPLOADS_FOLDER,
	MULTER,
}
