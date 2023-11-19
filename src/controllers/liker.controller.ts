import { Request, Response } from "express";
import likerService from "../services/liker.service";
import tweetService from "../services/tweet.service";
import userService from "../services/user.service";
class LikerController {
    public async createLike(req: Request, res: Response) {
        try {
            const { idTweet, idUser, username } = req.body
            const findTweet = await tweetService.listTweetById(idTweet)

            if (!findTweet) {
                return res.status(404).send({ message: "Tweet não encontrado" })
            }
            const response = await likerService.createLike({
                idTweet: findTweet?.data!.id,
                idAuthorTweet: findTweet?.data!.idUser,
                idAuthorLike: idUser!,
                authorLike: username,
                contentTweetLiked: findTweet.data?.content!,
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
            const { idUser } = req.body
            const { idLike } = req.params

            if (!idLike || !idUser) {
                return {
                    oK: false,
                    code: 400,
                    message: "Curtida para remover não encontrada"
                }
            }
            const response = await likerService.deleteLike({
                idAuthorLike: idUser,
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
            const { idUser } = req.body

            const result = await likerService.listLikesFromUser(idUser)

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


