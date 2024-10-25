import { JwtPayload, verify } from 'jsonwebtoken'
import authConfig from '../configs/auth' 
import { Request, Response, NextFunction } from 'express'

export function ensureAuth(req: Request, res: Response, next: NextFunction): void {
	const authHeader = req.headers.authorization

	if(!authHeader) {
		res.status(401).json({
			error: 'Unauthorized',
			message: 'Jwt token não informado'
		})
        
		return
	}

	const [, token] = authHeader.split(' ')

	try {
		const { sub: user_id } = verify(token, authConfig.jwt.secret) as JwtPayload

		req.user = {
			id: Number(user_id)
		}

		next()
	} catch {
		res.status(401).json({
			error: 'Unauthorized',
			message: 'Jwt invalid'
		})
	}  
}
