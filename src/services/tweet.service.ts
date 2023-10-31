
import prisma from "../database/prisma.database";
import { ResponseDto } from "../dto/response.dto";
import { FoundTweetDto, TweetDto, UpdateTweetDto } from "../dto/tweet.dto";
import { ReTweet } from "../models/reTweet.model"
import Tweet from "../models/tweet.model";
import { ReTweet as ReTweetPrisma, Tweet as TweetPrisma } from '@prisma/client'

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
                idUser
            },
            include: {
                like: true
            }
        })
        const reTweets = await prisma.reTweet.findMany({
            where: {
                idUserReTweet: idUser
            },
            include: {
                likes: true
            }
        })

        const tweetModel = tweets.map((item) => this.tweetMapToModel(item))
        const reTweetModel = reTweets.map((item) => this.reTweetMapToModel(item))

        return {
            ok: true,
            code: 200,
            message: "Tweets listados com sucesso",
            data: {
                tweets: tweetModel.map((item) => item.detailTweet()),
                reTweets: reTweetModel.map((item) => item.detailReTweet())
            }
        }
    }

    public async listAllTweets(): Promise<ResponseDto> {
        const allTweets = await prisma.tweet.findMany()
        const reTweets = await prisma.reTweet.findMany()

        const tweetsModel = allTweets.map((item) => this.tweetMapToModel(item))
        const reTweetModel = reTweets.map((item) => this.reTweetMapToModel(item))

        return {
            ok: true,
            code: 200,
            message: "Tweets listados com sucesso",
            data: {
                allTweets: tweetsModel.map((item) => item.detailTweet()),
                reTweets: reTweetModel.map((item) => item.detailReTweet())
            }
        }
    }

    public async listTweetById(data: FoundTweetDto) {
        const findTweet = await prisma.tweet.findUnique({
            where: {
                id: data.idTweet,
                idUser: data.idUser
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
            data: this.tweetMapToModel(findTweet).detailTweet()
        }
    }

    public async createTweet(data: TweetDto): Promise<ResponseDto> {
        const createTweet = await prisma.tweet.create({
            data: {
                idUser: data.idUser,
                content: data.content,
                authorTweet: data.authorTweet
            }
        })

        return {
            ok: true,
            code: 201,
            message: "Tweet criado com sucesso",
            data: this.tweetMapToModel(createTweet).detailTweetCreate()
        }
    }

    public tweetMapToModel(tweet: TweetPrisma): Tweet {
        const model = new Tweet(
            tweet.id,
            tweet.content,
            tweet.idUser,
            tweet.authorTweet,
        )
        return model
    }

    public reTweetMapToModel(reTweet: ReTweetPrisma): ReTweet {
        const model = new ReTweet(
            reTweet.idTweetOriginal!,
            reTweet.contentTweetOriginal,
            reTweet.authorTweetOriginal,
            reTweet.idUserReTweet,
            reTweet.contentReTweet,
            reTweet.authorReTweet,
            reTweet.idReTweet,
        )
        return model
    }

    public async updateTweet(data: UpdateTweetDto): Promise<ResponseDto> {

        const tweetFind = await prisma.tweet.findUnique({
            where: {
                id: data.idTweet,
                idUser: data.idUser
            }
        })

        if (!tweetFind) {
            return {
                ok: false,
                code: 404,
                message: "Tweet não encontrado"
            }
        }

        const updated = await prisma.tweet.update({
            where: {
                id: data.idTweet,
                idUser: data.idUser
            },
            data: {
                id: data.idTweet,
                content: data.content
            }
        })

        return {
            ok: true,
            code: 200,
            message: "Tweet atualizado com sucesso",
            data: this.tweetMapToModel(updated).detailTweet()
        }
    }

    public async deleteTweet(data: FoundTweetDto): Promise<ResponseDto> {

        const findTweet = await prisma.tweet.findUnique({
            where: {
                id: data.idTweet,
                idUser: data.idUser
            }
        })

        if (!findTweet) {
            return {
                ok: false,
                code: 404,
                message: "Tweet não encontrado"
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
            message: `Tweet id: ${findTweet.id} deletado com sucesso`,
        }
    }
}

export default new TweetService()