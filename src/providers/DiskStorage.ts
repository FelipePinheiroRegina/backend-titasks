import fs from 'fs'
import path from 'path'
import uploadConfig from '../configs/upload'

export class DiskStorage {
	async saveFile(file: string) {
		await fs.promises.rename(
			path.resolve(uploadConfig.TMP_FOLDER, file),
			path.resolve(uploadConfig.UPLOADS_FOLDER, file)
		)
        
		return file
	}

	async deleteFile(file: string) {
		const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)

		try {
			await fs.promises.stat(filePath)
		} catch {
			return
		}

		await fs.promises.unlink(filePath)
	}
}
