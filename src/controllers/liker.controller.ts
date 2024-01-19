import { Request, Response } from "express";
import likerService from "../services/liker.service";
class LikerController {
    public async createLike(req: Request, res: Response) {
        try {
            const { username } = req.authUser
            const { idTweet } = req.body

            const response = await likerService.createLike({
                idTweet: idTweet,
                usernameAuthorLike: username
            })
            return res.status(response.code).send(response)
        }

        catch (error: any) {
            res.status(500).send({
                ok: false,
                message: error.toString()
            })
        }
    }

    public async deleteLike(req: Request, res: Response) {
        try {
            const { id } = req.authUser
            const { idLike } = req.params

            if (!idLike || !id) {
                return {
                    oK: false,
                    code: 400,
                    message: "Curtida para remover não encontrada"
                }
            }
            const response = await likerService.deleteLike({
                idAuthorLike: id,
                idLike: idLike
            })

            return res.status(response.code).send(response)
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public async listLike(req: Request, res: Response) {
        try {
            const { id } = req.authUser

            const result = await likerService.listLikesFromUser(id)

            return res.status(result.code).send(result)
        }
        catch (error: any) {
            res.status(500).send({
                ok: false,
                message: error.toString()
            })
        }
    }
}

export default LikerController


