const knex = require("../database/knex")
const AppError = require('../utils/AppError')
const DiskStorage = require("../providers/DiskStorage")

class UserAvatarController {
    async update(req, res) {
        const user_id = req.user.id
        const avatarFilename = req.file.filename
        
        const diskStorage = new DiskStorage()

        const user = await knex('users').where({id: user_id}).first()

        if(!user) {
            throw new AppError('Apenas usuários autenticados podem mudar o avatar')
        }

        if(user.avatar) {
            await diskStorage.deleteFile(user.avatar)
        }

        const filename = await diskStorage.saveFile(avatarFilename)
        user.avatar = filename

        await knex('users').update(user).where({ id: user_id})

        const answer = await knex('answer').where("user_id", user_id).first()

        if (answer) {
            await knex('answer')
                .where("user_id", user_id)
                .update({
                    avatar_user_answer: filename
                })
        }


        return res.json(user)
    }
}

module.exports = UserAvatarController