import prisma from "../database/prisma.database"
import { CreateReTweetDto } from "../dto/reTweet.dto"
import { ResponseDto } from "../dto/response.dto"
import { ReTweet } from "../models/reTweet.model"
import { ReTweet as ReTweetPrisma } from "@prisma/client"

class ReTweetService {
    public async listReTweetsFromUser(idUser: string): Promise<ResponseDto> {

        const user = await prisma.user.findUnique({
            where: {
                id: idUser
            }
        })

        if (!user) {
            return {
                ok: false,
                code: 404,
                message: "Usuario não encontrado"
            }
        }

        const reTweets = await prisma.reTweet.findMany({
            where: {
                idUserReTweet: idUser
            }
        })

        const reTweetModel = reTweets.map((item) => this.reTweetMapToModel(item))

        return {
            ok: true,
            code: 200,
            message: "ReTweets listados com sucesso",
            data: {
                repTweets: reTweetModel.map((item) => item.detailReTweet())
            }
        }
    }

    public async createReTweet(data: CreateReTweetDto): Promise<ResponseDto> {

        const findTweet = await prisma.tweet.findUnique({
            where: {
                id: data.idTweetOriginal
            }
        })

        if (!findTweet) {
            return {
                ok: false,
                code: 404,
                message: "Tweet para responder não encontrado"
            }
        }

        const findContentTweet = findTweet.content
        const createReTweet = await prisma.reTweet.create({
            data: {
                idTweetOriginal: data.idTweetOriginal,
                contentTweetOriginal: findContentTweet,
                idUserReTweet: data.idUserReTweet,
                contentReTweet: data.contentReTweet,
            }
        })

        return {
            ok: true,
            code: 200,
            message: "ReTweet criado com sucesso",
            data: this.reTweetMapToModel(createReTweet).detailReTweet()
        }
    }


    public reTweetMapToModel(reTweet: ReTweetPrisma): ReTweet {
        const model = new ReTweet(
            reTweet.idTweetOriginal,
            reTweet.contentTweetOriginal,
            reTweet.idUserReTweet,
            reTweet.contentReTweet,
            reTweet.idReTweet,
        )
        return model
    }

    // public async updateReTweet(data: UpdateTweetDto): Promise<ResponseDto> {

    //     const tweetFind = await prisma.tweet.findUnique({
    //         where: {
    //             id: data.idTweet,
    //             idUser: data.idUser
    //         }
    //     })

    //     if (!tweetFind) {
    //         return {
    //             ok: false,
    //             code: 404,
    //             message: "Tweet não encontrado"
    //         }
    //     }

    //     const updated = await prisma.tweet.update({
    //         where: {
    //             id: data.idTweet,
    //             idUser: data.idUser
    //         },
    //         data: {
    //             id: data.idTweet,
    //             content: data.content
    //         }
    //     })

    //     return {
    //         ok: true,
    //         code: 200,
    //         message: "Tweet atualizado com sucesso",
    //         data: this.tweetMapToModel(updated).detailTweet()
    //     }
    // }

    // public async deleteTweet(data: FoundTweetDto): Promise<ResponseDto> {

    //     const findTweet = await prisma.tweet.findUnique({
    //         where: {
    //             id: data.idTweet,
    //             idUser: data.idUser
    //         }
    //     })

    //     if (!findTweet) {
    //         return {
    //             ok: false,
    //             code: 404,
    //             message: "Tweet não encontrado"
    //         }
    //     }

    //     await prisma.tweet.delete({
    //         where: {
    //             id: data.idTweet, idUser: data.idUser
    //         },
    //     })

    //     return {
    //         ok: true,
    //         code: 200,
    //         message: `Tweet id: "${findTweet.id}" deletado com sucesso`,
    //     }
    // }
}

export default new ReTweetService()