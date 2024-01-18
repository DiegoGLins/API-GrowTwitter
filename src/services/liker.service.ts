import prisma from "../database/prisma.database"
import { CreateLikeDto } from "../dto/create.like.dto";
import { DeleteLikeDto } from "../dto/deleteLike.dto";
import { ResponseDto } from "../dto/response.dto"
import tweetService from "./tweet.service";
import userService from "./user.service";

class LikerService {
    public async listLikesFromUser(idUser: string): Promise<ResponseDto> {
        const user = await prisma.liker.findFirst({
            where: {
                idAuthorTweet: idUser,
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
                idAuthorTweet: idUser
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
        const user = await userService.getByUser(data.authorLike)

        if (data.idTweet) {
            const findTweet = await tweetService.listTweetById(data.idTweet)
            const create = await prisma.liker.create({
                data: {
                    idTweet: findTweet.data?.id!,
                    idAuthorTweet: findTweet.data?.idUser!,
                    idAuthorLike: user?.id!,
                    authorLike: user?.username!,
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