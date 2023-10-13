import repository from "../database/prisma.database";
import { ResponseDto } from "../dto/response.dto";
import { TweetDto } from "../dto/tweet.dto";
import { Reply } from "../models/reply.model";
import Tweet from "../models/tweet.model";
import { ReTweet as ReTweetPrisma, Tweet as TweetPrisma } from '@prisma/client'

class TweetService {
    public async listTweetFromUser(idUser: string, idUserReply: string | undefined): Promise<ResponseDto> {

        const user = await repository.user.findUnique({
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

        const tweets = await repository.tweet.findMany({
            where: {
                idUser
            }
        })

        const replies = await repository.reTweet.findMany({
            where: {
                idUserReply
            }
        })

        const tweetModel = tweets.map((item) => this.tweetMapToModel(item))
        const replieModel = replies.map((item) => this.replieMapToModel(item))

        return {
            ok: true,
            code: 200,
            message: "Tweets listados com sucesso",
            data: {
                tweets: tweetModel.map((item) => item.detailTweet()),
                replies: replieModel.map((item) => item.detailReplie())
            }
        }
    }

    public async createTweet(data: TweetDto): Promise<ResponseDto> {

        const createTweet = await repository.tweet.create({
            data: {
                idUser: data.content,
                content: data.content
            }
        })
        return {
            ok: true,
            code: 200,
            message: "Tweet criado com sucesso",
            data: this.tweetMapToModel(createTweet).detailTweetCreate()
        }
    }

    public tweetMapToModel(tweet: TweetPrisma): Tweet {
        const model = new Tweet(
            tweet.idTweet,
            tweet.idUser,
            tweet.content
        )
        return model
    }

    public replieMapToModel(reply: ReTweetPrisma): Reply {
        const model = new Reply(
            reply.idTweetOriginal,
            reply.idUserTweetOriginal,
            reply.idUserReply,
            reply.contentReplay
        )
        return model
    }

    public async updateTweet() {

    }
}

export default new TweetService()