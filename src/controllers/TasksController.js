const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require("../providers/DiskStorage")
const { format } = require('date-fns-tz') 

class TasksController {
    async create(req, res) {
        const { title, description, deadline, status } = req.body;
        const user_id = req.user.id;
        const imageFileName = req.file ? req.file.filename : null;
    
        let image = null;
    
        if (imageFileName) {
            const diskStorage = new DiskStorage();
            image = await diskStorage.saveFile(imageFileName);
        }
    
        await knex('tasks')
            .insert({
                title,
                description,
                deadline,
                status,
                user_id,
                "created_at": knex.raw("datetime('now', 'localtime')"),
                image
            });
    
        return res.status(201).json({ msg: 'Task created successfully' });
    }
    
    async index(req, res) {
        let { title, status, date, mytasks } = req.query;
        const user_id = req.user.id
        
        if(status === 'Todas') {
            status = undefined
        }
        
        // Definindo a consulta base
        let query = knex('tasks')
          .select([
            "tasks.id",
            "users.name",
            "users.avatar",
            "tasks.title",
            "tasks.description",
            "tasks.status",
            "tasks.created_at",
            "tasks.deadline",
            "tasks.updated_at",
            "tasks.image"
          ])
          .innerJoin("users", "users.id", "tasks.user_id")
      
        // Aplicando filtros conforme os parâmetros recebidos
        if (status) {
          query = query.where('tasks.status', status);
        }
        
        if (title) {
          query = query.whereLike('tasks.title', `%${title}%`);
        }

        if (date) {
            query = query.whereLike('tasks.created_at', `%${date}%`);
        }

        if(mytasks === 'true') {
            query = query.where('tasks.user_id', user_id)
        }

        // Aplicando a ordenação por 'created_at' em ordem decrescente
        query = query.orderBy('tasks.created_at', 'desc');

        // Contando todas as tasks da tabela
        
        const [countAllTasks] = await knex('tasks')
        .count('* as total')

        const [countAllTasksDo] = await knex('tasks')
        .count('* as fazer')
        .where('status', 'Fazer')

        const [countAllTasksDoing] = await knex('tasks')
        .count('* as fazendo')
        .where('status', 'Fazendo')

        const [countAllTasksDone] = await knex('tasks')
        .count('* as feito')
        .where('status', 'Feito')
        // =====================================================


        // Contando apenas as tasks do usuario
        const [ countAllTasks_user_id ] = await knex('tasks')
        .count('* as total')
        .where('tasks.user_id', user_id)

         
        const [ countAllTasksDo_user_id ] = await knex('tasks')
        .count('* as fazer')
        .where('tasks.user_id', user_id).where('status', 'Fazer')

        
        const [ countAllTasksDoing_user_id ] = await knex('tasks')
        .count('* as fazendo')
        .where('tasks.user_id', user_id).where('status', 'Fazendo')

        
        const [ countAllTasksDone_user_id ] = await knex('tasks')
        .count('* as feito')
        .where('tasks.user_id', user_id).where('status', 'Feito')
        // =======================================================

        // Executando a consulta
        const response = await query
        
        // Converta as datas para o fuso horário de Brasília e obtenha os nomes dos usuários de resposta
        const formattedResponse = response.map(task => {
          const formattedTask = {
            ...task,
            created_at: format(new Date(task.created_at), "dd/MM/yyyy 'às' HH:mm:ss", { timeZone: 'America/Sao_Paulo' }),
            deadline: format(new Date(task.deadline), "dd/MM/yyyy 'às' HH:mm:ss", { timeZone: 'America/Sao_Paulo' })
          };
      
          if (task.updated_at) {
            formattedTask.updated_at = format(new Date(task.updated_at), "dd/MM/yyyy 'às' HH:mm:ss", { timeZone: 'America/Sao_Paulo' });
          }
      
          return formattedTask;
        });
      
        return res.json({
            formattedResponse, 
            countAllTasks, 
            countAllTasksDo, 
            countAllTasksDoing, 
            countAllTasksDone,
            
            countAllTasks_user_id,
            countAllTasksDo_user_id,
            countAllTasksDoing_user_id,
            countAllTasksDone_user_id
        });
    }

    async show(req, res){  
        const { id } = req.params
        const user_id = req.user.id
        

        const response = await knex("tasks")
            .select([
                "tasks.id",
                "users.name",
                "users.avatar",
                "tasks.title",
                "tasks.description",
                "tasks.status",
                "tasks.created_at",
                "tasks.deadline",
                "tasks.updated_at",
                "tasks.image"
            ])
            .where("tasks.id", id)
            .innerJoin("users", "users.id", "tasks.user_id")
    
        // Converta as datas para o fuso horário de Brasília
        const formattedResponse = response.map(task => {
            if(task.updated_at) {
                return {
                    ...task,
                    created_at: format(new Date(task.created_at), "dd/MM/yyyy 'às' HH:mm:ss", { timeZone: 'America/Sao_Paulo' }),
                    deadline: format(new Date(task.deadline), "dd/MM/yyyy 'às' HH:mm:ss", { timeZone: 'America/Sao_Paulo' }),
                    updated_at: format(new Date(task.updated_at), "dd/MM/yyyy 'às' HH:mm:ss", { timeZone: 'America/Sao_Paulo' })
                };

            } else {
                return {
                    ...task,
                    created_at: format(new Date(task.created_at), "dd/MM/yyyy 'às' HH:mm:ss", { timeZone: 'America/Sao_Paulo' }),
                    deadline: format(new Date(task.deadline), "dd/MM/yyyy 'às' HH:mm:ss", { timeZone: 'America/Sao_Paulo' })
                }
            }  
        })

        return res.json(formattedResponse)
    }

    async delete(req, res){
        const { id } = req.params

        await knex("tasks").where({ id }).delete()

        return res.json({msg: "Note deleted"})
    }

    async update(req, res){
        const { status } = req.body
        const { id } = req.params

        await knex("tasks").where({ id })
        .update({
            "status": status,
            "updated_at": knex.raw("datetime('now', 'localtime')"),
        })

        return res.json({msg: "Update successfully"})
    }
}

module.exports = TasksController