const AppError = require("../utils/AppError");
const sqliteConnection = require('../database/sqlite');
const { hash, compare } = require('bcryptjs');

class UserController {
    async create(req, res) {
        const { name, email, password } = req.body;

        try {
            const database = await sqliteConnection()
            
            // Verifica se o usuário já existe
            const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])
            
            if(checkUserExists){
                throw new AppError('E-mail already exists')
            }

            // Hash da senha
            const hashPassword = await hash(password, 8);

            // Insere o novo usuário
            await database.run("INSERT INTO users(name, email, password) VALUES (?, ?, ?)", [name, email, hashPassword])

            return res.status(201).json({
                message: 'User created with success'
            });
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(error.statusCode || 500).json({ error: error.message || 'Internal Server Error' });
        }
    }
    
    async update(req, res) {
        const { name, email, oldPassword, newPassword } = req.body;
        const user_id = req.user.id;

        const database = await sqliteConnection()

        // Busca o usuário pelo ID
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [ user_id ])

        if(!user){
            throw new AppError('User not found')
        }

        // Verifica se o e-mail já está em uso por outro usuário
        const userUpdate = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(userUpdate && userUpdate.id !== user.id){
            throw new AppError('E-mail is already in use')
        }

        // Atualiza os dados do usuário
        user.name = name   ?? user.name
        user.email = email ?? user.email;

        if(oldPassword && newPassword) {
            if(!oldPassword){
                throw new AppError('The oldpassword is required')
            }

            const checkedOldPassword = await compare(oldPassword, user.password)

            if(!checkedOldPassword){
                throw new AppError('Oldpassword invalid')
            }

            user.password =  await hash(newPassword, 8) 
        }
        

        await database.run(`
            UPDATE users SET 
            name = ?, 
            email = ?,
            password = ?,
            updated_at = DATETIME('now', 'localtime')
            WHERE id = (?)
            `, [user.name, user.email, user.password, user_id])

        return res.status(201).json({msg: `User ${user.name} updated with success!`})
    }
}

module.exports = UserController;
