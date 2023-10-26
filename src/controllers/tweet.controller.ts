// import { Request, Response } from "express";
// import tweetService from "../services/tweet.service";
// import reTweetService from "../services/reTweet.service";
// import { TweetType } from "../types/TweetType";
// import { resolve4 } from "dns";
// class TweetController {
//     public async createTweet(req: Request, res: Response) {
//         try {
//             const { idUser, content, username } = req.body

//             const result = await tweetService.createTweet({
//                 content: content,
//                 idUser: idUser,
//                 authorTweet: username,
//                 tipo: ""
//             })

//             return res.status(result.code).send(result)
//         }
//         catch (error: any) {
//             res.status(500).send({
//                 ok: false,
//                 message: error.toString()
//             })
//         }
//     }

//     public async createReTweet(req: Request, res: Response) {
//         try {
//             const { idTweetOriginal, idUser, content, username } = req.body

//             if (!idTweetOriginal) {
//                 return res.status(404).send({
//                     ok: false,
//                     code: 404,
//                     message: "Tweet para responder não encontrado"
//                 })
//             }
//             // const findReTweet = await reTweetService.listReTweetById(idTweetOriginal)
//             const findTweet = await tweetService.listTweetById(idTweetOriginal)

//             if (findTweet) {
//                 await tweetService.createTweet({
//                     content: content,
//                     idUser: idUser,
//                     authorTweet: username,
//                     tipo: ''
//                 })

//                 const result = await reTweetService.createReTweet({
//                     idTweetOriginal: idTweetOriginal,
//                     idUserReTweet: idUser,
//                     authorReTweet: username,
//                     content: content,
//                 })

//                 return res.status(result.code).send(result)
//             }
//         }
//         catch (error: any) {
//             res.status(500).send({
//                 ok: false,
//                 message: error.toString()
//             })
//         }
//     }



//     public async listTweets(req: Request, res: Response) {
//         try {
//             const { idUser } = req.body
//             const result = await tweetService.listTweetFromUser(idUser)

//             return res.status(result.code).send(result)
//         }
//         catch (error: any) {
//             res.status(500).send({
//                 ok: false,
//                 message: error.toString()
//             })
//         }
//     }

//     public async updateTweet(req: Request, res: Response) {
//         try {
//             const { idTweet } = req.params
//             const { idUser, content } = req.body

//             const result = await tweetService.updateTweet({
//                 idUser: idUser,
//                 idTweetOriginal: idTweet,
//                 content: content,
//                 authorTweet: "",
//                 tipo: ""
//             })

//             return res.status(result.code).send(result)
//         }
//         catch (error: any) {
//             res.status(500).send({
//                 ok: false,
//                 message: error.toString()
//             })
//         }
//     }

//     public async deleteTweet(req: Request, res: Response) {
//         try {
//             const { idUser } = req.body
//             const { idTweet } = req.params

//             const response = await tweetService.deleteTweet({
//                 idUser: idUser, idTweet: idTweet
//             })

//             return res.status(response.code).send(response)
//         } catch (error: any) {
//             res.status(500).send({
//                 ok: false,
//                 message: error.toString(),
//             });
//         }
//     }
// }


// export default TweetController

import { Request, Response } from "express";
import tweetService from "../services/tweet.service";
class TweetController {
    public async createTweet(req: Request, res: Response) {
        try {
            const { idUser, content, username } = req.body

            const result = await tweetService.createTweet({
                content: content,
                idUser: idUser,
                authorTweet: username
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



