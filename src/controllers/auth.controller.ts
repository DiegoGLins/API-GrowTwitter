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
        try {
            const { idUser } = req.body

            if (!idUser) {
                return res.status(401).send({
                    ok: false,
                    code: 401,
                    message: "Autenticação do token falhou",
                });
            }

            const userLogged = await userService.getById(idUser)

            if (userLogged) {
                const result = await userService.updateUser({ ...userLogged.data, token: null })
                console.log(userLogged)
                return res.status(200).send({
                    ok: false,
                    code: 200,
                    message: "Logout realizado com sucesso",
                    data: result.data
                })
            }

        } catch (error: any) {
            res.status(500).send({
                ok: false,
                code: 500,
                message: "Erro interno do servidor"
            })
        }
    }
}

export default AuthController