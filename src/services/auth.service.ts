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
                message: "Usuario não encontrado"
            }
        }

        const validatePassword = await compare(password, user.password)

        if (!validatePassword) {
            return {
                ok: false,
                code: 401,
                message: "Username ou senha incorretos"
            }
        }

        const authHeader = {
            id: user.id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            email: user.email,
        }

        const token = jwt.sign(authHeader, `${process.env.SECRET_WORD}`, {
            expiresIn: "8hr"
        })

        return {
            ok: true,
            code: 200,
            message: "Login realizado com sucesso",
            data: authHeader, token
        }
    }
}

export default new AuthService()