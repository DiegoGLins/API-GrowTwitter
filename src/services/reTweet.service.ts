
import prisma from "../database/prisma.database"
import { CreateReTweetDto, FoundReTweetDto, UpdateReTweetDto } from "../dto/reTweet.dto"
import { ResponseDto } from "../dto/response.dto"
import { ReTweet } from "../models/reTweet.model"
import Tweet from "../models/tweet.model";
import { ReTweet as ReTweetPrisma, Tweet as TweetPrisma } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

class ReTweetService {
    public async listReTweetsFromUser(idUser: string): Promise<ResponseDto> {

        const user = await prisma.user.findUnique({
            where: {
                id: idUser,
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
                reTweets: reTweetModel.map((item) => item.detailReTweet())
            }
        }
    }

    public async listReTweetById(idReTweet: string) {
        const findReTweet = await prisma.reTweet.findUnique({
            where: {
                idReTweet: idReTweet
            }
        })
        if (!findReTweet) {
            return {
                ok: false,
                code: 404,
                message: "ReTweet não encontrado"
            }
        }

        return {
            data: this.reTweetMapToModel(findReTweet).detailReTweet()
        }
    }

    public async createReTweet(data: CreateReTweetDto): Promise<ResponseDto> {

        const findTweet = await prisma.tweet.findUnique({
            where: {
                id: data.idTweetOriginal,
            }
        })

        if (findTweet) {
            const findContentTweet = findTweet?.content!
            const findAuthorTweet = findTweet?.authorTweet!
            const createReTweet = await prisma.reTweet.create({
                data: {
                    idTweetOriginal: findTweet.id!,
                    contentTweetOriginal: findContentTweet!,
                    authorTweetOriginal: findAuthorTweet!,
                    idUserReTweet: data.idUserReTweet!,
                    authorReTweet: data.authorReTweet,
                    contentReTweet: data.contentReTweet!,
                }
            })
            return {
                ok: true,
                code: 201,
                message: "ReTweet criado com sucesso",
                data: {
                    reTweet: this.reTweetMapToModel(createReTweet).detailReTweet(),
                }
            }
        }
        if (!findTweet) {
            const findReTweet = await prisma.reTweet.findFirst({
                where: {
                    idReTweet: data.idReTweet,
                }
            })
            if (findReTweet) {
                const findContentReTweet = findReTweet?.contentReTweet!
                const findAuthorReTweet = findReTweet?.authorReTweet!
                const createReTweet = await prisma.reTweet.create({
                    data: {
                        idTweetOriginal: findReTweet.idTweetOriginal,
                        contentTweetOriginal: findContentReTweet!,
                        authorTweetOriginal: findAuthorReTweet!,
                        idUserReTweet: data.idUserReTweet!,
                        contentReTweet: data.contentReTweet!,
                        authorReTweet: data.authorReTweet,
                    }
                })
                return {
                    ok: true,
                    code: 201,
                    message: "ReTweet criado com sucesso",
                    data: {
                        reTweet: this.reTweetMapToModel(createReTweet).detailReTweet(),
                    }
                }
            }
        }
        return {
            ok: false,
            code: 404,
            message: "Tweet para responder não encontrado"
        }
    }

    public async updateReTweet(data: UpdateReTweetDto): Promise<ResponseDto> {

        const reTweetFind = await prisma.reTweet.findUnique({
            where: {
                idReTweet: data.idReTweet,
                idUserReTweet: data.idUserReTweet
            }
        })

        if (!reTweetFind) {
            return {
                ok: false,
                code: 404,
                message: "reTweet não encontrado"
            }
        }

        const updated = await prisma.reTweet.update({
            where: {
                idReTweet: data.idReTweet,
                idUserReTweet: data.idUserReTweet
            },
            data: {
                idReTweet: data.idReTweet,
                contentReTweet: data.contentReTweet
            }
        })

        return {
            ok: true,
            code: 200,
            message: "ReTweet atualizado com sucesso",
            data: this.reTweetMapToModel(updated).detailReTweet()
        }
    }

    public async deleteReTweet(data: FoundReTweetDto): Promise<ResponseDto> {

        const findReTweet = await prisma.reTweet.findUnique({
            where: {
                idReTweet: data.idReTweet,
                idUserReTweet: data.idUserReTweet
            }
        })

        if (!findReTweet) {
            return {
                ok: false,
                code: 404,
                message: "ReTweet não encontrado"
            }
        }

        await prisma.reTweet.delete({
            where: {
                idReTweet: data.idReTweet,
                idUserReTweet: data.idUserReTweet
            },
        })

        return {
            ok: true,
            code: 200,
            message: `ReTweet id: ${findReTweet.idReTweet} deletado com sucesso`,
        }
    }

    public reTweetMapToModel(reTweet: ReTweetPrisma): ReTweet {
        const model = new ReTweet(
            reTweet.idReTweet,
            reTweet.idTweetOriginal!,
            reTweet.contentTweetOriginal,
            reTweet.authorTweetOriginal,
            reTweet.idUserReTweet,
            reTweet.authorReTweet,
            reTweet.contentReTweet,
        )
        return model
    }

    // public tweetMapToModel(tweet: TweetPrisma): Tweet {
    //     const model = new Tweet(
    //         tweet.id,
    //         tweet.content,
    //         tweet.idUser,
    //         tweet.authorTweet
    //     )
    //     return model
    // }
}

export default new ReTweetService()

