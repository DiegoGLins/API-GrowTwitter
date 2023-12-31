
import { Request, Response } from "express";
import tweetService from "../services/tweet.service";
class TweetController {
    public async createTweet(req: Request, res: Response) {
        try {
            const { idUser, content, username } = req.body

            const result = await tweetService.createTweet({
                content: content,
                authorTweet: username,
                idUser: idUser,
                type: '',
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

    public async createReTweet(req: Request, res: Response) {
        try {
            const { idUser, content, username, idTweetOriginal } = req.body

            const result = await tweetService.createReTweet({
                content: content,
                type: '',
                authorTweet: username,
                idUser: idUser,
                idTweetOriginal: idTweetOriginal,
            }
            )
            return res.status(result.code).send(result)
        }
        catch (error: any) {
            res.status(500).send({
                ok: false,
                message: error.toString()
            })
        }
    }

    public async listTweetsFromUser(req: Request, res: Response) {
        try {
            const { idUser } = req.body
            const result = await tweetService.listTweetFromUser(idUser)

            return res.status(result.code).send(result)
        }
        catch (error: any) {
            res.status(500).send({
                ok: false,
                message: error.toString()
            })
        }
    }

    public async listTweetByID(req: Request, res: Response) {
        try {
            const { idTweet } = req.params;

            const response = await tweetService.listTweetById(idTweet);

            return res.status(response.code).send(response)
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public async listAllTweets(req: Request, res: Response) {
        try {
            const result = await tweetService.listAllTweets()
            return res.status(result.code).send(result)
        }
        catch (error: any) {
            res.status(500).send({
                ok: false,
                message: error.toString()
            })
        }
    }


    public async updateTweet(req: Request, res: Response) {
        try {
            const { idTweet } = req.params
            const { idUser, content } = req.body

            const result = await tweetService.updateTweet({
                idUser: idUser,
                idTweet: idTweet,
                content: content
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

    public async deleteTweet(req: Request, res: Response) {
        try {
            const { idUser } = req.body
            const { idTweet } = req.params

            const response = await tweetService.deleteTweet({
                idUser: idUser, idTweet: idTweet
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


export default TweetController



