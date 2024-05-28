const knex = require("../database/knex")
const AppError = require('../utils/AppError')
const DiskStorage = require("../providers/DiskStorage")
const { format } = require('date-fns-tz') 

class AnswerController {
    async create(req, res) {
        const { answer } = req.body
        const user_id = req.user.id
        const task_id = Number(req.params.id)
        const printsFileName = req.file ? req.file.filename : null;
    
        let prints = null;
    
        if (printsFileName) {
            const diskStorage = new DiskStorage();
            prints = await diskStorage.saveFile(printsFileName);
        }
    
        const user = await knex('users').where({id: user_id}).first()

        if(!user) {
            throw new AppError('Apenas usuários autenticados podem anexar prints')
        }
     

        await knex('answer')
        .insert({
            answer, 
            prints, 
            user_id,
            task_id,
            "created_at": knex.raw("datetime('now', 'localtime')"),
            "name": user.name,
            "avatar_user_answer": user.avatar
        })
        
        return res.json({msg: 'created successfully'})
    }

    async index(req, res) {
        const { id } = req.params
        const user_id = req.user.id

        
        let response = await knex('answer').select([
            "users.name",
            "users.email",
            "users.avatar",
            "answer.*"
        ])
        .where('task_id', id)
        .groupBy('answer')
        .innerJoin('users', 'users.id', 'answer.user_id')
        .orderBy('created_at')

        const formatDateAnswer = response.map(answer => ({
            ...answer,
            created_at: format(new Date(answer.created_at), "dd/MM/yyyy 'às' HH:mm:ss", { timeZone: 'America/Sao_Paulo' })
        }))

        return res.json(formatDateAnswer)
    }
}

module.exports = AnswerController