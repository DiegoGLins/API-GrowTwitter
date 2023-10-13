import { Request, Response } from 'express'
import userService from '../services/user.service'
import { ResponseDto } from '../dto/response.dto'

class AuthController {
    public async login(req: Request, res: Response) {

        const { name, username, email, password } = req.body
        const userLogged = await userService.getByUser(name, username, email, password)

        if (!userLogged) {
            return res.status(401).send({ message: "username ou senha incorretos" })
        }

        const loggedModel = {
            id: userLogged.id,
            username: userLogged.username,
            email: userLogged.email
        }

        const response: ResponseDto = {
            ok: true,
            code: 200,
            message: "Login efetuado com sucesso",
            data: loggedModel
        }
        return response
    }
}

export default AuthController