import { Request, Response } from "express";
import reTweetService from "../services/reTweet.service";

class ReTweetController {
    public async createReTweet(req: Request, res: Response) {
        try {
            const { idTweetOriginal, idUser, contentReTweet, username } = req.body

            const result = await reTweetService.createReTweet({
                idTweetOriginal: idTweetOriginal,
                contentTweetOriginal: "",
                idUserReTweet: idUser,
                contentReTweet: contentReTweet,
                authorReTweet: username
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

    public async listReTweets(req: Request, res: Response) {
        try {
            const { idUser } = req.body

            const result = await reTweetService.listReTweetsFromUser(idUser)

            return res.status(result.code).send(result)
        }
        catch (error: any) {
            res.status(500).send({
                ok: false,
                message: error.toString()
            })
        }
    }

    public async updateReTweet(req: Request, res: Response) {
        try {
            const { idReTweet } = req.params
            const { idUser, contentReTweet } = req.body

            const result = await reTweetService.updateReTweet({
                idReTweet: idReTweet,
                contentReTweet: contentReTweet,
                idUserReTweet: idUser
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

    public async deleteReTweet(req: Request, res: Response) {
        try {
            const { idUserReTweet } = req.body
            const { idReTweet } = req.params

            const response = await reTweetService.deleteReTweet({
                idReTweet: idReTweet,
                idUserReTweet: idUserReTweet
            })

            return res.status(response.code).send(response)
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }
}


export default ReTweetController


