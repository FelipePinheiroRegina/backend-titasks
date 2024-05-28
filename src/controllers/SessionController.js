const knex = require("../database/knex")
const appError = require("../utils/AppError")
const { compare } = require("bcryptjs")
const authConfig = require("../configs/auth")
const { sign } = require("jsonwebtoken")

class SessionController {
    async create(request, response) {
        const { email, password } = request.body

        const user = await knex('users').where({ email }).first()

        if(!user) {
            throw new appError('Email ou senha inválida(o)')
        }

        const validPassword = await compare(password, user.password)

        if(!validPassword) {
            throw new appError('Email ou senha inválida(o)')
        }

        const { secret, expiresIn } = authConfig.jwt
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        return response.json({
            user,
            token
        })
    }
}

module.exports = SessionController
