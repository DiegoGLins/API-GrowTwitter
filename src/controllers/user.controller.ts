import { Request, Response } from 'express'
import userService from '../services/user.service'
export class UserController {

    public async list(req: Request, res: Response) {
        const result = await userService.listAllUsers()
        return res.status(result.code).send(result)
    }

    public async listUserByToken(req: Request, res: Response) {
        try {
            const { token } = req.body
            const result = await userService.getByToken(token)
            return res.status(200).send({
                ok: true,
                code: 200,
                message: "Usuario listado com sucesso",
                data: result
            })
        }
        catch (error: any) {
            res.status(500).send({
                ok: false,
                message: error.toString()
            })
        }
    }

    public async register(req: Request, res: Response) {
        try {
            const { name, username, email, password } = req.body

            const result = await userService.createUser({
                name,
                username,
                email,
                password,
            })

            return res.status(result.code).send(result)
        }

        catch (error: any) {
            return {
                ok: false,
                code: 500,
                message: error.toString()
            }
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { name, username, email, password } = req.body

            const result = await userService.updateUser({
                id: id,
                name: name,
                username: username,
                email: email,
                password: password
            })

            return res.status(result.code).send(result)
        } catch (error: any) {
            return {
                ok: false,
                code: 500,
                message: error.toString()
            }
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { id } = req.params
            const result = await userService.deleteUser(id)

            return res.status(result.code).send(result)

        } catch (error: any) {
            return {
                ok: true,
                code: 500,
                message: error.toString()
            }
        }
    }
}

