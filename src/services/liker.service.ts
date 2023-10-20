import prisma from "../database/prisma.database"
import { CreateLikeDto, CreateLikeReTweetDto, RemoveLikeDto } from "../dto/create.like.dto";
import { ResponseDto } from "../dto/response.dto"
import { Liker } from "../models/liker.model";
import { Liker as LikerPrisma } from '@prisma/client'

class likerService {
    public async listLikesFromUser(idUser: string): Promise<ResponseDto> {

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

        const likes = await prisma.liker.findMany({
            where: {
                idAuthorTweet: idUser
            }
        })

        const likeModel = likes.map((item) => this.likeMapToModel(item))

        return {
            ok: true,
            code: 200,
            message: "likes listados com sucesso",
            data: {
                likes: likeModel.map((item) => item.detailLike())
            }
        }
    }

    public async createLike(data: CreateLikeDto): Promise<ResponseDto> {

        const checkLikeUser = await prisma.liker.findFirst({
            where: {
                AND: [
                    { idTweet: data.idTweet },
                    { idAuthorLike: data.idAuthorLike }
                ]
            }
        })

        if (checkLikeUser) {
            return {
                ok: false,
                code: 404,
                message: "Você já curtiu esse tweet"
            }
        }

        const createLike = await prisma.liker.create({
            data: {
                idAuthorTweet: data.idAuthorTweet!,
                idAuthorLike: data.idAuthorLike!,
                authorLike: data.authorLike!,
                contentTweetLiked: data.contentTweetLiked!,
                contentReTweet: '',
                idTweet: data.idTweet!,
            }
        })
        return {
            ok: true,
            code: 201,
            message: "Tweet curtido com sucesso",
            data: {
                like: {
                    idLike: createLike.idLike,
                    idTweet: createLike.idTweet,
                    authorLike: createLike.authorLike,
                    contentTweetLiked: createLike.contentTweetLiked
                }
            }
        }
    }

    public async createLikeR(data: CreateLikeReTweetDto): Promise<ResponseDto> {

        const checkLikeUser = await prisma.liker.findFirst({
            where: {
                AND: [
                    { idReTweet: data.idReTweet },
                    { idAuthorLike: data.idAuthorLike }
                ]
            }
        })

        if (checkLikeUser) {
            return {
                ok: false,
                code: 404,
                message: "Você já curtiu esse tweet"
            }
        }

        const createLike = await prisma.liker.create({
            data: {
                idAuthorReTweet: data.idAuthorReTweet,
                idAuthorLike: data.idAuthorLike,
                authorLike: data.authorLike,
                contentReTweet: data.contentReTweet,
                idReTweet: data.idReTweet,
            }
        })
        return {
            ok: true,
            code: 201,
            message: "Tweet curtido com sucesso",
            data: {
                like: {
                    idLike: createLike.idLike,
                    idReTweet: createLike.idReTweet,
                    idAuthorReTweet: createLike.idAuthorReTweet,
                    idAuthorLike: createLike.idAuthorLike,
                    authorLike: createLike.authorLike,
                    contentReTweet: createLike.contentReTweet
                }
            }
        }
    }

    public async removeLike(data: RemoveLikeDto): Promise<ResponseDto> {

        const findTweetLiked = await prisma.liker.findFirst({
            where: {
                idLike: data.idLike,
                idAuthorLike: data.idUser
            }
        })

        if (!findTweetLiked) {
            return {
                ok: false,
                code: 404,
                message: "Curtida não encontrada"
            }
        }

        await prisma.liker.delete({
            where: {
                idLike: data.idLike,
                idAuthorLike: data.idUser
            },
        })

        return {
            ok: true,
            code: 200,
            message: 'Curtida removida com sucesso',
        }
    }

    public likeMapToModel(like: LikerPrisma): Liker {
        const model = new Liker(
            like.idLike,
            like.idTweet!,
            like.idAuthorTweet!,
            like.idAuthorLike,
            like.authorLike,
            like.contentTweetLiked!,
        )
        return model
    }
}

export default new likerService()