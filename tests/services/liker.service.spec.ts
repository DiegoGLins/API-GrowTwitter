import { Liker, Tweet, User } from '@prisma/client'
import LikerService from '../../src/services/liker.service'
import TweetService from '../../src/services/tweet.service'
import UserService from '../../src/services/user.service'
import { prismaMock } from '../config/prisma.mock'
import { CreateLikeDto } from '../../src/dto/create.like.dto'

describe('LikerService', () => {
    const createSut = () => {
        return {
            LikerService, TweetService, UserService
        }
    }
    describe('listLikesFromUser', () => {
        test('Deve retornar a mensagem: "Likes ou usuário não encontrados" caso seja passado o id de um Usuario que não recebeu likes em seus tweets', async () => {
            const sut = createSut()

            prismaMock.liker.findFirst.mockResolvedValue(null)

            const result = await sut.LikerService.listLikesFromUser("any_id")

            expect(result).toEqual({
                ok: false,
                code: 404,
                message: "Likes ou usuario não encontrados"
            })
        })

        test('Deve retornar a lista de likes recebidos do autor do tweet', async () => {
            const sut = createSut()

            const likeData = [{
                idLike: "any_idLike",
                idTweet: "any_idTweet",
                idAuthorTweet: "any_idAuthorTweet",
                idAuthorLike: "any_idAuthorLike",
                authorLike: "any_authorLike",
                contentTweetLiked: "any_contentTweetLiked"
            }]

            prismaMock.liker.findFirst.mockResolvedValue({
                idLike: "any_idLike",
                idTweet: "any_idTweet",
                idAuthorTweet: "any_idAuthorTweet",
                idAuthorLike: "any_idAuthorLike",
                authorLike: "any_authorLike",
                contentTweetLiked: "any_contentTweetLiked"
            })

            prismaMock.liker.findMany.mockResolvedValue(likeData)
            const result = await sut.LikerService.listLikesFromUser("any_idAuthorTweet")

            expect(result).toEqual({
                ok: true,
                code: 200,
                message: "likes listados com sucesso",
                data: {
                    likes: [{
                        contentTweetLiked: "any_contentTweetLiked",
                        likes: 1,
                    }]
                }
            })
        })
    })

    describe('createLike', () => {
        test('Deve retornar a mensagem: "Usuario não está logado" caso o autor do like não seja encontrado', async () => {
            const sut = createSut();

            prismaMock.user.findUnique.mockResolvedValue(null);

            prismaMock.liker.create.mockResolvedValue({} as Liker)
            const result = await sut.LikerService.createLike({} as CreateLikeDto);

            expect(result).toEqual({
                ok: false,
                code: 404,
                message: "Usuario não está logado",
            });
        })

        test.only('Deve retornar o tweet curtido com os dados da curtida ao passar o id do Tweet a ser curtido', async () => {
            const sut = createSut()

            prismaMock.user.findUnique.mockResolvedValue({
                id: "any_id",
                username: "any_username"
            } as User);
            prismaMock.tweet.findUnique.mockResolvedValue({
                id: "any_idTweet",
                content: "any_contentTweetLiked",
                idUser: "any_idUser",
                authorTweet: "any_authorTweet",
                type: "any_type",
                idTweetOriginal: "any_idTweetOriginal"
            })
            const tweet = await sut.TweetService.listTweetById("any_idTweet")
            const user = await sut.UserService.getByUser("any_username")

            prismaMock.liker.create.mockResolvedValue({
                idLike: "any_idLike",
                idTweet: tweet.data?.id!,
                idAuthorTweet: "any_AuthorTweet",
                idAuthorLike: "any_user_id",
                authorLike: user?.username!,
                contentTweetLiked: "any_contentTweetLiked"
            })

            const result = await sut.LikerService.createLike({
                idTweet: "any_idTweet",
                idAuthorTweet: "any_idAuthorTweet",
                idAuthorLike: user?.id!,
                authorLike: user?.username!,
                contentTweetLiked: "any_contentTweetLiked"
            } as CreateLikeDto)

            expect(result).toEqual({
                ok: true,
                code: 201,
                message: "Tweet curtido com sucesso",
                data: {
                    idLike: "any_idLike",
                    idTweet: "any_idTweet",
                    idAuthorTweet: "any_AuthorTweet",
                    idAuthorLike: "any_user_id",
                    authorLike: "any_username",
                    contentTweetLiked: "any_contentTweetLiked",
                }
            }
            )
        })

        test('', () => {

        })
    })

    describe('deleteLike', () => {
        test('', () => {

        })
    })
})