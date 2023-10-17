import { Request, Response } from "express";
import reTweetService from "../services/reTweet.service";

class ReTweetController {
    public async create(req: Request, res: Response) {
        try {
            const { idTweetOriginal, idUser, contentReTweet } = req.body

            const result = await reTweetService.createReTweet({
                idTweetOriginal: idTweetOriginal,
                contentTweetOriginal: "",
                idUserReTweet: idUser,
                contentReTweet: contentReTweet
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

    // public async listTweets(req: Request, res: Response) {
    //     try {
    //         const { idUser } = req.body

    //         const result = await tweetService.listTweetFromUser(idUser)

    //         return res.status(result.code).send(result)
    //     }
    //     catch (error: any) {
    //         res.status(500).send({
    //             ok: false,
    //             message: error.toString()
    //         })
    //     }
    // }

    // public async updateTweet(req: Request, res: Response) {
    //     try {
    //         const { idTweet } = req.params
    //         const { idUser, content } = req.body

    //         const result = await tweetService.updateTweet({
    //             idUser: idUser,
    //             idTweet: idTweet,
    //             content: content
    //         })

    //         return res.status(result.code).send(result)
    //     }
    //     catch (error: any) {
    //         res.status(500).send({
    //             ok: false,
    //             message: error.toString()
    //         })
    //     }
    // }

    // public async delete(req: Request, res: Response) {
    //     try {
    //         const { idUser } = req.body
    //         const { idTweet } = req.params

    //         const response = await tweetService.deleteTweet({
    //             idUser: idUser, idTweet: idTweet
    //         })

    //         return res.status(response.code).send(response)
    //     } catch (error: any) {
    //         res.status(500).send({
    //             ok: false,
    //             message: error.toString(),
    //         });
    //     }
    // }
}


export default ReTweetController


