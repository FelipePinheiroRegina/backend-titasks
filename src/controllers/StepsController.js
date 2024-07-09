const DiskStorage = require('../providers/DiskStorage')
const knex = require('../database/knex')

class StepsController {
    async create(req, res) {
        const { id } = req.params
        const user_id = req.user.id
        const { description } = req.body
        
        const fileName = req.file ? req.file.filename : null;

        const user = await knex('users').where({id: user_id}).first()

        if(!user) {
            throw new AppError('Apenas usuários autenticados')
        }
        
        let media = null

        if(fileName) {
            const diskStorage = new DiskStorage()
            media = await diskStorage.saveFile(fileName)
        }
        
        const documentations_id = id

        await knex('steps')
        .insert({
            description,
            media,
            "created_at": knex.raw("datetime('now', 'localtime')"),
            "updated_at": knex.raw("datetime('now', 'localtime')"),
            documentations_id
        })

        return res.json({msg: 'created successfully'})
    }

    async index(req, res){
        const { id } = req.params

        const steps = await knex('steps').where({ documentations_id: id })
        
        return res.json(steps)
    }
}

module.exports = StepsController