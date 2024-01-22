import { Request, Response } from 'express'
import userService from '../services/user.service'
export class UserController {

    public async list(req: Request, res: Response) {
        const result = await userService.listAllUsers()
        return res.status(result.code).send(result)
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
            return res.status(500).send({
                ok: false,
                code: 500,
                message: error.toString()
            })
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
            return res.status(500).send({
                ok: false,
                code: 500,
                message: error.toString()
            })
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { id } = req.params
            const result = await userService.deleteUser(id)

            return res.status(result.code).send(result)

        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                code: 500,
                message: error.toString()
            })
        }
    }
}

