const DiskStorage = require('../providers/DiskStorage')
const knex = require('../database/knex')

class DocumentationsController {
    async create(req, res) {
        const { title, description } = req.body
        const user_id = req.user.id
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
      
        await knex('documentations')
        .insert({
            title, 
            description,
            media,
            "created_at": knex.raw("datetime('now', 'localtime')"),
            "updated_at": knex.raw("datetime('now', 'localtime')")
        })

        return res.json({msg: 'created successfully'})
    }
    
    async index(req, res) {
        const { title } = req.query;
    
        // Começa a construção da query
        let query = knex('documentations').select('*');
        
        // Adiciona condição condicionalmente
        if (title) {
            query = query.where('title', 'like', `%${title}%`);
        }
    
        // Executa a query e retorna o resultado
        const results = await query;
        return res.json(results);
    }
    

    async show(req, res) {
        const { id } = req.params

        const document = await knex('documentations').where('id', id)

        return res.json(document)
    }
}

module.exports = DocumentationsController