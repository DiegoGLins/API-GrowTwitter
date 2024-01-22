
import prisma from "../database/prisma.database";
import { ResponseDto } from "../dto/response.dto";
import { CreateTweetDto, FoundTweetDto, UpdateTweetDto } from "../dto/tweet.dto";
import { TweetType } from "../types/TweetType";

class TweetService {
    public async listTweetFromUser(idUser: string): Promise<ResponseDto> {

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

        const tweets = await prisma.tweet.findMany({
            where: {
                idUser,
            },
            include: {
                likes: true,
                reTweet: {
                    include: {
                        user: true
                    },
                }, tweetOriginal: {
                    include: {
                        user: true
                    }
                }
            },
        }
        )

        return {
            ok: true,
            code: 200,
            message: "Tweets listados com sucesso",
            data: tweets
        }
    }

    public async listAllTweets(): Promise<ResponseDto> {
        const allTweets = await prisma.tweet.findMany({
            include: {
                // user: true,
                likes: true,
                reTweet: true,
                tweetOriginal: true
            }
        })

        return {
            ok: true,
            code: 200,
            message: "Tweets listados com sucesso",
            data: allTweets
        }
    }

    public async listTweetById(idTweet: string) {
        try {
            const findTweet = await prisma.tweet.findUnique({
                where: {
                    id: idTweet,
                },
                include: {
                    likes: true,
                    reTweet: true
                }
            })
            if (!findTweet) {
                return {
                    ok: false,
                    code: 404,
                    message: "Tweet não encontrado"
                }
            }
            return {
                ok: true,
                code: 200,
                message: "Tweet listado com sucesso",
                data: findTweet
            }
        } catch (error: any) {
            return {
                ok: false,
                code: 500,
                message: error.toString()
            }
        }
    }

    public async createTweet(data: CreateTweetDto): Promise<ResponseDto> {
        const typeN = TweetType.normal
        const createTweet = await prisma.tweet.create({
            data: {
                content: data.content,
                idUser: data.idUser,
                authorTweet: data.authorTweet,
                type: typeN,
                idTweetOriginal: data.idTweetOriginal
            }, include: {
                // user: true,
                likes: true,
                reTweet: true,
                tweetOriginal: true
            }
        })
        return {
            ok: true,
            code: 201,
            message: "Tweet criado com sucesso",
            data: createTweet
        }
    }

    public async createReTweet(data: CreateTweetDto): Promise<ResponseDto> {
        const typeR = TweetType.reTweet

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

        const createReTweet = await prisma.tweet.create({
            data: {
                content: data.content,
                idUser: data.idUser,
                authorTweet: data.authorTweet,
                type: typeR,
                idTweetOriginal: data.idTweetOriginal,
            }, include: {
                user: true,
                likes: true,
                reTweet: true,
                tweetOriginal: {
                    include: {
                        user: true
                    }
                }
            }
        })
        return {
            ok: true,
            code: 201,
            message: "Tweet criado com sucesso",
            data: createReTweet
        }
    }


    public async updateTweet(data: UpdateTweetDto): Promise<ResponseDto> {

        const findTweet = await prisma.tweet.findUnique({
            where: {
                id: data.idTweet,
            }
        })

        if (!findTweet) {
            return {
                ok: false,
                code: 404,
                message: "Tweet para editar não encontrado"
            }
        }

        if (findTweet?.idUser !== data.idUser) {
            return {
                ok: false,
                code: 403,
                message: "Você não tem permissão para editar esse tweet"
            }
        }

        const updated = await prisma.tweet.update({
            where: {
                id: data.idTweet,
            },
            data: {
                content: data.content
            }
        })

        return {
            ok: true,
            code: 200,
            message: "Tweet atualizado com sucesso",
            data: updated
        }
    }

    public async deleteTweet(data: FoundTweetDto): Promise<ResponseDto> {

        const findTweet = await prisma.tweet.findUnique({
            where: {
                id: data.idTweet,
            }
        })

        if (!findTweet) {
            return {
                ok: false,
                code: 404,
                message: "Tweet não encontrado"
            }
        }

        if (findTweet?.idUser !== data.idUser) {
            return {
                ok: false,
                code: 403,
                message: "Você não tem permissão para deletar esse tweet"
            }
        }

        await prisma.tweet.delete({
            where: {
                id: data.idTweet, idUser: data.idUser
            },
        })

        return {
            ok: true,
            code: 200,
            message: 'Tweet deletado com sucesso',
        }
    }
}

export default new TweetService()

