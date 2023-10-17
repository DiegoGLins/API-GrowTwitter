import { Request, Response } from "express";
import tweetService from "../services/tweet.service";
import Tweet from "../models/tweet.model";
class TweetController {
    public async create(req: Request, res: Response) {
        try {

            const { idUser, content, authorTweet } = req.body

            const result = await tweetService.createTweet({
                content: content,
                idUser: idUser,
                authorTweet
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

    public async listTweets(req: Request, res: Response) {
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

    public async delete(req: Request, res: Response) {
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

    // // public feedTweet(tweet: string, user: Follow) {
    // //     const findTweet = tweets.find(item => item.content === tweet)
    // //     const findReply = replies.find(item => item.authorReply.id === user.id)


    // //     if (findTweet) {
    // //         if (findTweet?.likes.length === 0) {
    // //             console.log(`@${user.username} : ${findTweet?.content}`)
    // //             console.log(`[ ${findTweet.likes.length} curtidas ]`)
    // //             console.log("=========================================================================")
    // //         }

    // //         if (findTweet!.likes.length === 1) {
    // //             console.log(`@${findTweet?.detailTweet().author} : ${findTweet?.content}`)
    // //             console.log(`[ @${findTweet!.likes.map(item => item.authorlike.username)} curtiu isso ]`)
    // //             console.log("=========================================================================")

    // //         }

    // //         if (findTweet!.likes.length >= 2) {
    // //             console.log(`@${findTweet?.detailTweet().author} : ${findTweet?.content} `)
    // //             console.log(`[ @${findTweet!.likes[0].authorlike.username} e mais ${findTweet?.likes.length - 1} curtiram ]`)
    // //             console.log("=========================================================================")
    // //         }

    // //         if (findTweet) {
    // //             if (findTweet.replies.length) {
    // //                 console.log(`@${findTweet.detailTweet().author} : ${findTweet.content}`)
    // //                 console.log(`> @${findTweet.replies.find(item => item.authorReply.username)}: ${findTweet.replies.find(item => item.contentTweetReply)}\n likes: ${findTweet.replies.find(item => item.likes.length)}`)
    // //                 console.log("=========================================================================")
    // //             }
    // //         }
    // //     }


    // //     if (findReply) {
    // //         if (findReply.likes.length === 0) {
    // //             console.log(`@${findReply.authorTweet.username} : ${findReply!.contentTweetReply}`)
    // //             console.log(`[ ${findReply.likes.length} curtidas ]`)
    // //             console.log("=========================================================================")
    // //         }

    // //         else if (findReply.likes.length === 1) {
    // //             console.log(`@${findReply.authorTweet.username} : ${findReply!.contentTweetReply}`)
    // //             console.log(`[ @${findReply!.likes.map(item => item.authorlike.username)} curtiu isso ]`)
    // //             console.log("=========================================================================")
    // //         }

    // //         else if (findReply.likes.length >= 2) {
    // //             console.log(`@${findReply.authorTweet.username} : ${findReply!.contentTweetReply} `)
    // //             console.log(`[ @${findReply!.likes[0].authorlike.username} e outros ${findReply!.likes.length - 1} curtiram ]`)
    // //             console.log("=========================================================================")
    // //         }
    // //     }

    // //     if (findReply) {
    // //         for (const reply of replies) {
    // //             const authorTweet = reply.authorReply.username
    // //             const contentTweet = reply.detailReplie().replyTo?.content
    // //             const authorReply = reply.authorTweet.username
    // //             const content = reply.contentTweetReply
    // //             const likes = reply.likes.length
    // //             console.log(`@${authorTweet} : ${contentTweet}`)
    // //             console.log(`> @${authorReply}: ${content}\n [ ${likes} likes ] \n [ ${replies.length - 1} replies ]`)
    // //             console.log("=========================================================================")
    // //         }
    // //     }
    // }
}


export default TweetController


