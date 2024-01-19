import { Request, Response } from 'express'
import authService from '../services/auth.service'
class AuthController {
    public async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body

            const result = await authService.login(username, password)
            return res.status(result.code).send(result)
        }

        catch (error: any) {
            res.status(500).send({
                ok: false,
                code: 500,
                message: error.toString()
            })
        }
    }
}

export default AuthController