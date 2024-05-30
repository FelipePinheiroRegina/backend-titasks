const AppError = require("../utils/AppError");
const postgresConnection = require('../database/postgres');
const { hash, compare } = require('bcryptjs');

class UserController {
    async create(req, res) {
        const { name, email, password } = req.body;

        try {
            const db = await postgresConnection();
            
            // Verifica se o usuário já existe
            const checkUserExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            if (checkUserExists.rows.length > 0) {
                throw new AppError('E-mail already exists', 400);
            }

            // Hash da senha
            const hashPassword = await hash(password, 8);

            // Insere o novo usuário
            await db.query('INSERT INTO users(name, email, password) VALUES($1, $2, $3)', [name, email, hashPassword]);

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

        try {
            const db = await postgresConnection();

            // Busca o usuário pelo ID
            const user = await db.query('SELECT * FROM users WHERE id = $1', [user_id]);
            if (user.rows.length === 0) {
                throw new AppError('User not found', 404);
            }

            // Verifica se o e-mail já está em uso por outro usuário
            const userWithEmail = await db.query('SELECT * FROM users WHERE email = $1 AND id <> $2', [email, user_id]);
            if (userWithEmail.rows.length > 0) {
                throw new AppError('E-mail is already in use', 400);
            }

            // Atualiza os dados do usuário
            const updatedUser = {
                name: name || user.rows[0].name,
                email: email || user.rows[0].email,
                updated_at: new Date().toISOString()
            };

            if (newPassword) {
                if (!oldPassword) {
                    throw new AppError('You need to enter the old password', 400);
                }
                // Verifica se a senha antiga está correta
                const checkOldPassword = await compare(oldPassword, user.rows[0].password);
                if (!checkOldPassword) {
                    throw new AppError('Invalid password', 400);
                }
                // Hash da nova senha
                updatedUser.password = await hash(newPassword, 8);
            }

            // Atualiza os dados do usuário no banco de dados
            await db.query(`
                UPDATE users SET
                name = $1,
                email = $2,
                password = $3,
                updated_at = $4
                WHERE id = $5
            `, [updatedUser.name, updatedUser.email, updatedUser.password || user.rows[0].password, updatedUser.updated_at, user_id]);

            return res.json({ message: 'User updated with success' });
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(error.statusCode || 500).json({ error: error.message || 'Internal Server Error' });
        }
    }
}

module.exports = UserController;
