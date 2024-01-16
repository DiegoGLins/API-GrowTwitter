import { Request, Response } from 'express'
import followService from '../services/follow.service'
import userService from '../services/user.service'
export class FollowController {

    public async list(req: Request, res: Response) {
        const { id } = req.authUser
        const result = await followService.listFollows(id)
        return res.status(result.code).send(result)
    }

    public async addFollow(req: Request, res: Response) {
        try {
            const { idUserFollowing } = req.params
            const { username, id } = req.authUser
            const { usernameFollowing, } = req.body
            const findFollowing = await userService.getByUser(usernameFollowing)

            if (!findFollowing) {
                return res.status(404).send({ message: "Usuario não encontrado" })
            }
            const result = await followService.addFollowing({
                usernameFollowing: usernameFollowing,
                idUserFollowing: idUserFollowing,
                idUserFollower: id,
                usernameFollower: username
            })

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

    public async deleteFollow(req: Request, res: Response) {
        try {
            const { idUserFollowing } = req.params
            const { usernameFollowing } = req.body
            const result = await followService.deleteFollow(usernameFollowing, idUserFollowing)

            return res.status(result.code).send(result)

        } catch (error: any) {
            res.status(500).send({
                ok: false,
                code: 500,
                message: error.toString()
            })
        }
    }
}

