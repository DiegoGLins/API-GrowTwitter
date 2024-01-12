import userService from "./user.service"
import { compare } from "bcrypt";
import jwt from 'jsonwebtoken'

class AuthService {
    public async login(username: string, password: string) {
        const user = await userService.getByUser(username)

        if (!user) {
            return {
                ok: false,
                code: 404,
                message: "usuario não encontrado"
            }
        }

        const validatePassword = await compare(password, user.data?.password!)

        if (!validatePassword) {
            return {
                ok: false,
                code: 401,
                message: "username ou senha incorretos"
            }
        }

        const authHeader = {
            id: user.data?.id,
            name: user.data?.name,
            username: user.data?.username,
            avatar: user.data?.avatar,
            email: user.data?.email,
        }

        const token = jwt.sign(authHeader, `${process.env.SECRET_WORD}`, {
            expiresIn: "8hr"
        })

        return {
            ok: true,
            code: 200,
            message: "Login realizado com sucesso",
            data: {
                authHeader,
                token
            }
        }
    }

}

export default new AuthService()