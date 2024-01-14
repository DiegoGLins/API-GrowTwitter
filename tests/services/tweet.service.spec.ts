
import { Tweet } from '@prisma/client'
import TweetService from '../../src/services/tweet.service'
import { prismaMock } from '../config/prisma.mock'
import { TweetType } from '../../src/types/TweetType'
import { CreateTweetDto, FoundTweetDto, UpdateTweetDto } from '../../src/dto/tweet.dto'

describe('TweetService', () => {
    const createSut = () => {
        return TweetService
    }

    describe('listTweetFromUser', () => {
        test('Deve retornar a mensagem: "Usuario não encontrado" caso seja passado o id de um usuario não cadastrado"', async () => {
            const sut = createSut()

            prismaMock.user.findUnique.mockResolvedValue(null);

            const result = await sut.listTweetFromUser('any_id')

            expect(result).toEqual({
                ok: false,
                code: 404,
                message: "Usuario não encontrado"
            })
        })

        test('Deve listar todos os tweets correspondente ao id do usuário passado', async () => {
            const sut = createSut()

            prismaMock.user.findUnique.mockResolvedValue({
                id: "any_uuid",
                avatar: "any_avatar",
                name: "any_name",
                username: "any_username",
                email: "any_email",
                password: "any_password"
            });

            prismaMock.tweet.findMany.mockResolvedValue([] as Tweet[])

            const result = await sut.listTweetFromUser("any_uuid")

            expect(result).toHaveProperty("ok", true)
            expect(result).toHaveProperty("code", 200)
            expect(result).toHaveProperty("message", "Tweets listados com sucesso")
            expect(result).toHaveProperty("data", [])

        })
    })

    describe('listAllTweets', () => {
        test('Deve retornar a lista de todos os tweets ', async () => {
            const sut = createSut()

            prismaMock.tweet.findMany.mockResolvedValue([] as Tweet[])

            const result = await sut.listAllTweets()

            expect(result).toHaveProperty("ok", true)
            expect(result).toHaveProperty("code", 200)
            expect(result).toHaveProperty("message", "Tweets listados com sucesso")
            expect(result).toHaveProperty("data", [])
        })
    })

    describe('listTweetById', () => {
        test('Deve retornar a mensagem: "Tweet não encontrado" ao ser passado o id de um tweet inexistente', async () => {
            const sut = createSut()

            prismaMock.tweet.findUnique.mockResolvedValue(null)

            const result = await sut.listTweetById('')

            expect(result).toEqual({
                ok: false,
                code: 404,
                message: "Tweet não encontrado"
            })

        })

        test('Deve retornar um tweet de acordo com o id do tweet passado', async () => {
            const sut = createSut()

            const tweetData = {
                id: "any_id",
                content: "any_content",
                idUser: "any-idUser",
                authorTweet: "any_authorTweet",
                type: "any_type",
                idTweetOriginal: "any_id"
            }
            prismaMock.tweet.findUnique.mockResolvedValue(tweetData)

            const result = await sut.listTweetById("any_id")

            expect(result).toEqual({
                ok: true,
                code: 200,
                message: "Tweet listado com sucesso",
                data: tweetData
            });
        })
    })

    describe('createTweet', () => {
        test('Deve retornar um tweet criado', async () => {
            const sut = createSut()

            prismaMock.tweet.create.mockResolvedValue({} as Tweet)

            const result = await sut.createTweet({
                content: "any_content",
                idUser: "any_idUser",
                authorTweet: "any_authorTweet",
                type: TweetType.normal,
                idTweetOriginal: "any_idTweetOriginal"
            })

            expect(result).toEqual({
                ok: true,
                code: 201,
                message: "Tweet criado com sucesso",
                data: {}
            })
        })
    })

    describe('createReTweet', () => {
        test('Deve retornar a mensagem: "Tweet para responder não encontrado" caso seja passado o id de um tweet inexistente', async () => {
            const sut = createSut()
            prismaMock.tweet.findUnique.mockResolvedValue(null)

            prismaMock.tweet.create.mockResolvedValue({
                id: 'any_id',
                content: "any_content",
                idUser: "any_idUser",
                authorTweet: "any_authorTweet",
                type: TweetType.reTweet,
                idTweetOriginal: 'any_idTweetOriginal'
            })

            const result = await sut.createReTweet({} as CreateTweetDto)

            expect(result).toEqual({
                ok: false,
                code: 404,
                message: "Tweet para responder não encontrado"
            }
            )
        })

        test('Deve retornar um reTweet criado', async () => {
            const sut = createSut()

            const tweetData = {
                id: "any_id",
                content: "any_content",
                idUser: "any_idUser",
                authorTweet: "any_authorTweet",
                type: TweetType.reTweet,
                idTweetOriginal: "any_idTweetOriginal"
            }

            prismaMock.tweet.findUnique.mockResolvedValue({
                id: 'any_id',
                content: "any_content",
                idUser: "any_idUser",
                authorTweet: "any_authorTweet",
                type: TweetType.normal,
                idTweetOriginal: 'any_idTweetOriginal'
            })

            prismaMock.tweet.create.mockResolvedValue(tweetData)

            const result = await sut.createReTweet(tweetData)

            expect(result).toEqual({
                ok: true,
                code: 201,
                message: "Tweet criado com sucesso",
                data: tweetData
            })
        })
    })

    describe('updateTweet', () => {
        test('Deve retornar a mensagem: "Você não tem permissão para editar esse tweet" caso o id do autor do tweet seja diferente do id do usuario passado', async () => {
            const sut = createSut()

            const tweetData = {
                idUser: "any_idUser",
                idTweet: "any_idTweet",
                content: "any_content"
            }

            prismaMock.tweet.findUnique.mockResolvedValue({
                id: "any_id",
                content: "any_content",
                idUser: "other_idUser",
                authorTweet: "any_authorTweet",
                type: TweetType.normal,
                idTweetOriginal: "any_idTweetOriginal"
            })

            const result = await sut.updateTweet(tweetData)

            expect(result).toEqual({
                ok: false,
                code: 403,
                message: "Você não tem permissão para editar esse tweet",
            })
        })

        test('Deve retornar a mensagem : "Tweet para editar não encontrado" caso seja passado o id de um tweet inexistente', async () => {
            const sut = createSut()

            prismaMock.tweet.findUnique.mockResolvedValue(null)

            prismaMock.tweet.update.mockRejectedValue({} as Tweet)

            const result = await sut.updateTweet({} as UpdateTweetDto)

            expect(result).toEqual({
                ok: false,
                code: 404,
                message: "Tweet para editar não encontrado"
            })

        })

        test('Deve retornar o tweet editado ao passar o id do tweet a ser editado', async () => {
            const sut = createSut()

            prismaMock.tweet.findUnique.mockResolvedValue({
                id: "any_id",
                content: "any_content",
                idUser: "any_idUser",
                authorTweet: "any_authorTweet",
                type: TweetType.normal,
                idTweetOriginal: "any_idTweetOriginal"
            })

            prismaMock.tweet.update.mockResolvedValue({} as Tweet)

            const result = await sut.updateTweet({
                idTweet: "any_id",
                idUser: "any_idUser",
                content: 'tweet_updated',
            })

            expect(result).toEqual({
                ok: true,
                code: 200,
                message: "Tweet atualizado com sucesso",
                data: {} as UpdateTweetDto
            })
        })
    })

    describe('deleteTweet', () => {
        test('Deve retornar a mensagem: "Você não tem permissão para deletar esse tweet" caso o id do autor do tweet seja diferente do id do usuario passado', async () => {
            const sut = createSut()

            const tweetData = {
                idUser: "any_idUser",
                idTweet: "any_idTweet",
                content: "any_content"
            }

            prismaMock.tweet.findUnique.mockResolvedValue({
                id: "any_id",
                content: "any_content",
                idUser: "other_idUser",
                authorTweet: "any_authorTweet",
                type: TweetType.normal,
                idTweetOriginal: "any_idTweetOriginal"
            })

            const result = await sut.deleteTweet(tweetData)

            expect(result).toEqual({
                ok: false,
                code: 403,
                message: "Você não tem permissão para deletar esse tweet",
            })
        })

        test('Deve retornar a mensagem: "Tweet não encontrado" caso seja passado o id de um Tweet inexistente para excluir', async () => {
            const sut = createSut()

            prismaMock.tweet.findUnique.mockResolvedValue(null)

            prismaMock.tweet.update.mockRejectedValue({} as Tweet)

            const result = await sut.deleteTweet({} as FoundTweetDto)

            expect(result).toEqual({
                ok: false,
                code: 404,
                message: "Tweet não encontrado"
            })
        })

        test('Deve retornar a mensagem: "Tweet deletado com sucesso" ao passar o id de um Tweet a ser deletado', async () => {
            const sut = createSut()
            prismaMock.tweet.findUnique.mockResolvedValue({
                id: "any_id",
                content: "any_content",
                idUser: "any_idUser",
                authorTweet: "any_authorTweet",
                type: TweetType.normal,
                idTweetOriginal: "any_idTweetOriginal"
            })

            prismaMock.tweet.delete.mockResolvedValue({} as Tweet)

            const result = await sut.deleteTweet({
                idTweet: "any_id",
                idUser: "any_idUser"
            })

            expect(result).toEqual({
                ok: true,
                code: 200,
                message: "Tweet deletado com sucesso",
            })
        })
    })
})

