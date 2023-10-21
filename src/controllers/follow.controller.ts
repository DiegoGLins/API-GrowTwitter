import { Request, Response } from 'express'
import followService from '../services/follow.service'
import userService from '../services/user.service'
export class FollowController {

    public async list(req: Request, res: Response) {
        const { idUser } = req.body
        const result = await followService.listFollows(idUser)
        return res.status(result.code).send(result)
    }

    public async addFollow(req: Request, res: Response) {
        try {
            const { idUserFollowing } = req.params
            const { usernameFollowing, username, idUser } = req.body
            const findFollowing = await userService.getUserByUsername(usernameFollowing)

            if (!findFollowing) {
                return res.status(404).send({ message: "Usuario não encontrado" })
            }
            const result = await followService.addFollwing({
                usernameFollowing: usernameFollowing,
                idUserFollowing: idUserFollowing,
                idUserFollower: idUser,
                usernameFollower: username
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

    public async deleteFollow(req: Request, res: Response) {
        try {
            const { idUserFollowing } = req.params
            const { usernameFollowing } = req.body
            const result = await followService.deleteFollow(usernameFollowing, idUserFollowing)

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

