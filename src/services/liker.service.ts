import prisma from "../database/prisma.database"
import { CreateLikeDto, ListLikeDto } from "../dto/like.dto";
import { DeleteLikeDto } from "../dto/deleteLike.dto";
import { ResponseDto } from "../dto/response.dto"
import { Liker } from "../models/liker.model";
import tweetService from "./tweet.service";
import userService from "./user.service";
import { Liker as LikerPrisma } from '@prisma/client'

class LikerService {
    public async listLikesFromUser(data: ListLikeDto): Promise<ResponseDto> {
        const user = await prisma.liker.findFirst({
            where: {
                idAuthorTweet: data.idAuthorTweet,
                idTweet: data.idTweet
            }
        })

        if (!user) {
            return {
                ok: false,
                code: 404,
                message: "Likes ou usuario não encontrados"
            }
        }

        const likedTweets = await prisma.liker.findMany({
            where: {
                idAuthorTweet: data.idAuthorTweet
            }
        })

        const likeslist = likedTweets.map((likedTweet) => {
            return {
                contentTweetLiked: likedTweet.contentTweetLiked,
                likes: likedTweets.filter((item) => item.idTweet === likedTweet.idTweet).length
            }
        })

        return {
            ok: true,
            code: 200,
            message: "likes listados com sucesso",
            data: {
                likes: likeslist
            }
        }
    }

    public async createLike(data: CreateLikeDto): Promise<ResponseDto> {

        if (!data.idTweet) {
            return {
                ok: false,
                code: 404,
                message: "Tweet para curtir não selecionado"
            }
        }

        const user = await userService.getUserByUsername(data.authorLike)

        if (!user) {
            return {
                ok: false,
                code: 404,
                message: "Usuario não está logado"
            }
        }

        if (data.idTweet) {
            const findTweet = await tweetService.listTweetById(data.idTweet)
            const create = await prisma.liker.create({
                data: {
                    idTweet: findTweet.data?.id!,
                    idAuthorTweet: findTweet.data?.idUser!,
                    idAuthorLike: user.data?.id!,
                    authorLike: user.data?.username!,
                    contentTweetLiked: findTweet.data?.content!
                }
            })
            return {
                ok: true,
                code: 201,
                message: "Tweet curtido com sucesso",
                data: create
            }
        }
        return {
            ok: false,
            code: 404,
            message: "Tweet para curtir não encontrado"
        }
    }

    public async deleteLike(data: DeleteLikeDto): Promise<ResponseDto> {
        const findLike = await prisma.liker.findUnique({
            where: {
                idLike: data.idLike
            }
        })
        if (findLike) {
            const result = await prisma.liker.delete({
                where: {
                    idLike: data.idLike,
                    idAuthorLike: data.idAuthorLike
                }
            })
            return {
                ok: true,
                code: 200,
                message: "Curtida removida com sucesso",
                data: result
            }
        }
        return {
            ok: false,
            code: 400,
            message: "Curtida para remover não encontrada"
        }
    }
}

export default new LikerService()