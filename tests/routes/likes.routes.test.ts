import jwt from 'jsonwebtoken'
import prisma from '../../src/database/prisma.database'
import request from 'supertest'
import { createServer } from '../../src/express.server'
import { randomUUID } from 'crypto'
import { TweetType } from '../../src/types/TweetType'

const makeUser = async () => {
    const user = await prisma.user.create({
        data: {
            name: "any_name",
            username: "any_username",
            email: "any_email",
            password: "any_password"
        }
    })
    return user
}

const makeToken = async () => {
    const createdUser = await makeUser()
    const authHeader = {
        id: createdUser.id,
        name: createdUser.name,
        username: createdUser.username
    }
    const token = jwt.sign(authHeader, `${process.env.SECRET_WORD}`, {
        expiresIn: "8hr"
    })

    return { createdUser, token }
}

const makeTweet = async () => {
    const { createdUser, token } = await makeToken()
    const tweet = await prisma.tweet.create({
        data: {
            id: randomUUID(),
            content: "any_content",
            idUser: createdUser.id,
            authorTweet: createdUser.username,
            type: TweetType.normal,
            idTweetOriginal: null
        }
    })
    return { tweet, createdUser, token }
}

const makeLike = async () => {
    const { tweet, createdUser, token } = await makeTweet()
    const like = await prisma.liker.create({
        data: {
            idLike: randomUUID(),
            idTweet: tweet.id,
            idAuthorTweet: createdUser.id,
            idAuthorLike: tweet.idUser,
            authorLike: createdUser.username,
            contentTweetLiked: tweet.content
        }
    })
    return { like, createdUser, token }
}

describe('LikerService', () => {
    const server = createServer()

    beforeEach(async () => {
        await prisma.liker.deleteMany()
        await prisma.tweet.deleteMany()
        await prisma.user.deleteMany()
    })

    afterAll(async () => {
        await prisma.liker.deleteMany()
        await prisma.tweet.deleteMany()
        await prisma.user.deleteMany()
    })


    describe('listLikesFromUser', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).get("/likes")

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })

        test('Deve retornar "Likes ou usuario não encontrado" caso seja passado o id de um usuario que não recebeu like em pelo menos um tweet', async () => {
            const { token } = await makeToken()

            const response = await request(server).get("/likes").set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                ok: false,
                code: 404,
                message: "Likes ou usuario não encontrados"
            })
        })

        test('Deve listar os tweets curtidos do usuário logado trazendo o conteudo curtido e o numero de likes', async () => {
            const { token } = await makeLike()

            const response = await request(server).get("/likes").set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                ok: true,
                code: 200,
                message: "likes listados com sucesso",
                data: {
                    likes: [{
                        contentTweetLiked: "any_content",
                        likes: 1
                    }]
                }
            })
        })
    })

    describe('createLike', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).post("/likes")

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })

        test('Deve retornar "Tweet curtido com sucesso" com os dados da curtida', async () => {
            const { token, tweet, createdUser } = await makeTweet()

            const response = await request(server).post('/likes').send({ idTweet: tweet.id }).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(201)
            expect(response.body).toEqual({
                ok: true,
                code: 201,
                message: "Tweet curtido com sucesso",
                data: {
                    idLike: expect.any(String),
                    idTweet: tweet.id,
                    idAuthorTweet: createdUser.id,
                    idAuthorLike: tweet.idUser,
                    authorLike: createdUser.username,
                    contentTweetLiked: tweet.content
                }
            })
        })

        //revisar metodo
        test.skip('Deve retornar "Tweet para curtir não encontrado" caso seja passado o id de um tweet inexistente', async () => {
            const { token } = await makeToken()

            const response = await request(server).post(`/likes`).send({ idTweet: randomUUID() }).set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                ok: false,
                code: 404,
                message: "Tweet para curtir não encontrado"
            })
        })
    })

    describe('deleteLike', () => {
        test('Deve retornar "Curtida removida com sucesso" com os dados do like removido', async () => {
            const { token, like } = await makeLike()

            const response = await request(server).delete(`/likes/${like.idLike}`).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                ok: true,
                code: 200,
                message: "Curtida removida com sucesso",
                data: {
                    idLike: expect.any(String),
                    idTweet: like.idTweet,
                    idAuthorTweet: like.idAuthorTweet,
                    idAuthorLike: like.idAuthorLike,
                    authorLike: like.authorLike,
                    contentTweetLiked: like.contentTweetLiked
                }
            })
        })

        test('Deve retornar "Curtida para remover não encontrada" caso seja passado o id de um like inexistente', async () => {
            const { token } = await makeToken()

            const response = await request(server).delete(`/likes/${randomUUID()}`).set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                ok: false,
                code: 400,
                message: "Curtida para remover não encontrada"
            })
        })
    })
})