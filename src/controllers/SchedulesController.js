const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class SchedulesController {
    async create(req, res) {
        const { title, description, price, timesReschedule } = req.body
        let { scheduled } = req.body
        const user_id = req.user.id

        if(timesReschedule > 0) {
            for(let c = 1; c <= timesReschedule; c++) {
                await knex('schedule').insert({
                    title,
                    description,
                    scheduled,
                    price,
                    user_id
                })
    
                scheduled =  scheduled.split('-')
                let month = Number(scheduled[1])
                month++
                month = `0${month}`
                scheduled[1] = month
                scheduled = scheduled.join('-')
            }

        } else {

            await knex('schedule').insert({
                title,
                description,
                scheduled,
                price,
                user_id
            })
        }
        
        return res.json({msg: "created"})
    }

    async index(req, res) {
        let { title, done } = req.query;
        const user_id = req.user.id;
    
        // Definindo a consulta base
        let schedule = knex('schedule').where({ user_id });
    
        // Aplicando filtros conforme os parâmetros recebidos
        if (done !== undefined && done !== 'all') {
            done = done === 'true'; // Conversão de string para booleano
            schedule = schedule.where('done', done);
        }
    
        if (title) {
            schedule = schedule.whereLike('title', `%${title}%`);
        }
    
        schedule.orderBy('scheduled', 'asc');
    
        const response = await schedule;
    
        return res.json(response);
    } 
    
    async update(req, res) {
        const { id } = req.params;
        const { statePriority, stateDone, whichClick } = req.body;
        
        const schedule = await knex('schedule').where({ id }).first();
        
        if (!schedule) {
            throw new AppError('Apenas usuários autenticados');
        }

        if(whichClick === 'schedule') {
            const priority = statePriority
            await knex('schedule').update({ priority: Boolean(priority) }).where({ id });
        }

        if(whichClick === 'check') {
            if(statePriority === 1) {
                const priority = 0
                await knex('schedule').update({ priority: Boolean(priority) }).where({ id });
            }
            const done = stateDone
            await knex('schedule').update({ done: Boolean(done) }).where({ id });
        }
        
        return res.json('successfully');
    }
}

module.exports = SchedulesController