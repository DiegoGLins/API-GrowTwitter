import { Request, Response } from 'express'
import userService from '../services/user.service'
import { ResponseDto } from '../dto/response.dto'
import { v4 as createToken } from 'uuid'
class AuthController {
    public async login(req: Request, res: Response) {
        const { username, password } = req.body

        const user = await userService.getByUser(
            username,
            password
        )

        if (!user) {
            return res.status(401).send({
                ok: false,
                code: 401,
                message: "Usuario ou senha incorretos"
            })
        }

        const token = createToken()
        const update = await userService.updateUser({ ...user, token: token })
        const logged = userService.mapToModel(user).detailUser()

        const result: ResponseDto = {
            ok: true,
            code: 200,
            message: "Login efetuado com sucesso",
            data: {
                logged,
                token
            }
        }

        if (update.code === 200) {
            return res.status(result.code).send(result)
        }
    }

    public async logout(req: Request, res: Response) {
        const token = req.headers.authorization
        const userLogged = await userService.getByToken(token as string)
        try {
            if (userLogged) {
                const response: ResponseDto = {
                    ok: true,
                    code: 200,
                    message: "Logout realizado com sucesso"
                }

                await userService.updateUser({ ...userLogged, token: null })
                return res.status(response.code).send(response)
            }
        } catch (error) {
            const response: ResponseDto = {
                ok: false,
                code: 404,
                message: "Logout não encontrado"
            }

            return res.status(response.code).send(response)
        }
    }
}

export default AuthController