import { Request, Response } from "express";
import likerService from "../services/liker.service";
import tweetService from "../services/tweet.service";
import reTweetService from "../services/reTweet.service";

class LikerController {
    public async createLike(req: Request, res: Response) {
        try {
            const { idTweet } = req.params
            const { idUser, username } = req.body
            const findTweet = await tweetService.listTweetById(idTweet)

            if (!findTweet) {
                return res.status(findTweet).send({ message: "Tweet não encontrado" })
            }
            const response = await likerService.createLike({
                idTweet: findTweet.data?.idTweet!,
                idAuthorTweet: findTweet.data?.idUser!,
                idAuthorLike: idUser,
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

    public async createLikeR(req: Request, res: Response) {
        try {
            const { idReTweet } = req.params
            const { idUser, username } = req.body
            const findReTweet = await reTweetService.listReTweetById(idReTweet)

            if (!findReTweet) {
                return res.status(findReTweet).send({ message: "ReTweet não encontrado" })
            }
            const response = await likerService.createLikeR({
                idReTweet: findReTweet.data?.idReTweet!,
                idAuthorReTweet: findReTweet.data?.idUserReTweet!,
                idAuthorLike: idUser,
                authorLike: username,
                contentReTweet: findReTweet.data?.contentReTweet!,
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

    public async removeLike(req: Request, res: Response) {
        try {
            const { idLike } = req.params
            const { idUser } = req.body

            const result = await likerService.removeLike({
                idLike: idLike,
                idUser: idUser
            })

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


