
import { Request, Response } from "express";
import tweetService from "../services/tweet.service";
class TweetController {
    public async createTweet(req: Request, res: Response) {
        try {
            const { username, id } = req.authUser
            const { content } = req.body

            const result = await tweetService.createTweet({
                content: content,
                authorTweet: username,
                idUser: id,
                type: '',
            })
            if (result.ok) {
                return res.status(result.code).send(result)
            }
            else {
                return res.status(500).send({
                    ok: false,
                    message: "Error creating tweet",
                });
            }
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
            const { id, username } = req.authUser
            const { content, idTweetOriginal } = req.body

            const result = await tweetService.createReTweet({
                content: content,
                type: '',
                authorTweet: username,
                idUser: id,
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
            const { id } = req.authUser
            const result = await tweetService.listTweetFromUser(id)

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
            const { id } = req.authUser
            const { content } = req.body

            const result = await tweetService.updateTweet({
                idUser: id,
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
            const { id } = req.authUser
            const { idTweet } = req.params

            const response = await tweetService.deleteTweet({
                idUser: id, idTweet: idTweet
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



