import { Request, Response } from 'express'
import userService from '../services/user.service'
import { ResponseDto } from '../dto/response.dto'
import { v4 as createToken } from 'uuid'
class AuthController {
    public async login(req: Request, res: Response) {
        const { username, email, password } = req.body

        const user = await userService.getByUser(
            username,
            email,
            password
        )

        if (!user) {
            return res.status(401).send({ message: "Usuario ou senha incorretos" })
        }

        const token = createToken()
        const update = await userService.updateUser({ ...user, token: token })
        const logged = userService.mapToModel(user).detailUser()

        const result: ResponseDto = {
            ok: true,
            code: 200,
            message: "Login efetuado com sucesso",
            data: {
                logged: logged,
                token: token
            }
        }

        if (update.code === 200) {
            return res.status(result.code).send(result)
        }
    }
}

export default AuthController