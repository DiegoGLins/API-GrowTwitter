import prisma from "../database/prisma.database"
import { CreateLikeDto } from "../dto/create.like.dto";
import { ResponseDto } from "../dto/response.dto"

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

        const checkLikeUser = await prisma.liker.findUnique({
            where: {
                idTweet: data.idTweet!,
                idAuthorLike: data.idAuthorLike,
            }
        })

        if (checkLikeUser) {
            await prisma.liker.delete({
                where: {
                    idTweet: data.idTweet!,
                    idAuthorLike: data.idAuthorLike,
                },
            })

            return {
                ok: false,
                code: 200,
                message: "Curtida removida com sucesso"
            }
        }

        const createLike = await prisma.liker.create({
            data: {
                idAuthorTweet: data.idAuthorTweet!,
                idAuthorLike: data.idAuthorLike!,
                authorLike: data.authorLike!,
                contentTweetLiked: data.contentTweetLiked!,
                idTweet: data.idTweet!,
            }
        })
        return {
            ok: true,
            code: 200,
            message: "Tweet curtido com sucesso",
            // data: {
            //     like: {
            //         idLike: createLike.idLike,
            //         idTweet: createLike.idTweet,
            //         authorLike: createLike.authorLike,
            //         contentTweetLiked: createLike.contentTweetLiked
            //     }
            // }
        }
    }

}

export default new LikerService()