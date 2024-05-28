const AppError = require("../utils/AppError")
const sqliteConnection = require('../database/sqlite')
const { hash, compare } = require('bcryptjs')
const { application } = require("express")

class UserController {
    async create(req, res){
        const { name, email, password } = req.body

        const database = await sqliteConnection()
        const checkUsersExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkUsersExists){
            throw new AppError('E-mail already exists')
        }

        const hashPassword = await hash(password, 8)

        await database.run('INSERT INTO users(name, email, password) VALUES(?, ?, ?)', [name, email, hashPassword])

        return res.status(201).json({
            message: 'User created with success'
        })
    }
    
    async update(req, res){
        const { name, email, oldPassword, newPassword } = req.body
        const user_id = req.user.id

        const database = await sqliteConnection()
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [ user_id ])

        if(!user){
            throw new AppError('User not found')
        }

        const userUpdate = await database.get("SELECT * FROM users WHERE email = (?)", [ email ])
        
        if(userUpdate && userUpdate.id !== user.id){
            throw new AppError('E-mail is already in use')
        }

        user.name  = name  ?? user.name
        user.email = email ?? user.email
        
        if(newPassword && !oldPassword){
            throw new AppError('Your need enter with old password')
        }

        if( newPassword && oldPassword) {
            const checkOldPassword = await compare(oldPassword, user.password)

            if(!checkOldPassword){
                throw new AppError('Password invalid')
            } 
            
            user.password = await hash(newPassword, 8)
        } 

        await database.run(`
            UPDATE users SET
            name = (?),
            email = (?),
            password = (?),
            updated_at = DATETIME('now', 'localtime')
            WHERE id = (?)`,
            [user.name, user.email, user.password, user_id])

        return res.json({msg: 'User updated with success'})
    }
}

module.exports = UserController