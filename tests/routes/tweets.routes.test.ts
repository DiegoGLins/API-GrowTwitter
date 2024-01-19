import jwt from 'jsonwebtoken'
import prisma from '../../src/database/prisma.database'
import request from 'supertest'
import { createServer } from '../../src/express.server'
import { TweetType } from '../../src/types/TweetType'
import { randomUUID } from 'crypto'

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

const makeOtherUser = async () => {
    const user = await prisma.user.create({
        data: {
            name: "other_name",
            username: "other_username",
            email: "other_email",
            password: "other_password"
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

const makeTweet = async (idUser: string, authorTweet: string) => {
    const tweet = await prisma.tweet.create({
        data: {
            id: randomUUID(),
            content: "any_content",
            idUser,
            authorTweet,
            type: TweetType.normal,
            idTweetOriginal: null
        }
    })
    return tweet
}

describe('Tweets Routes', () => {
    let server: any = createServer()

    beforeEach(async () => {
        await prisma.tweet.deleteMany()
        await prisma.user.deleteMany()
    })

    afterAll(async () => {
        await prisma.tweet.deleteMany()
        await prisma.user.deleteMany()
    })

    describe('listTweetsFromUser - GET', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).get("/tweets")

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })

        test('Deve retornar a lista de tweets do usuario logado contendo um tweet', async () => {
            const { token, createdUser } = await makeToken()
            const createdTweet = await makeTweet(createdUser.id, createdUser.username)

            const response = await request(server).get(`/tweets/fromUser`).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                ok: true,
                code: 200,
                message: "Tweets listados com sucesso",
                data: [{
                    id: createdTweet.id,
                    content: createdTweet.content,
                    idUser: createdTweet.idUser,
                    authorTweet: createdTweet.authorTweet,
                    type: createdTweet.type,
                    idTweetOriginal: null,
                    likes: [],
                    reTweet: [],
                    tweetOriginal: null,
                    user: expect.any(Object)
                }]
            });
        })
    })
    describe('createTweet - POST', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).post("/tweets")

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })

        test('Deve criar um tweet no banco', async () => {
            const { token, createdUser } = await makeToken()

            const response = await request(server).post('/tweets').send({ content: "any_content" }).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(201)
            expect(response.body).toEqual({
                ok: true,
                code: 201,
                message: "Tweet criado com sucesso",
                data: {
                    id: expect.any(String),
                    content: "any_content",
                    idUser: createdUser.id,
                    authorTweet: createdUser.username,
                    type: TweetType.normal,
                    idTweetOriginal: null,
                    likes: [],
                    reTweet: [],
                    tweetOriginal: null
                }
            })
        })
    })
    describe('listAllTweets - GET', () => {
        test('Deve listar os tweets, contendo um tweet', async () => {
            const { token, createdUser } = await makeToken()
            const createdTweet = await makeTweet(createdUser.id, createdUser.username)

            const response = await request(server).get('/tweets').set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                ok: true,
                code: 200,
                message: "Tweets listados com sucesso",
                data: [{
                    id: createdTweet.id,
                    content: createdTweet.content,
                    idUser: createdTweet.idUser,
                    authorTweet: createdTweet.authorTweet,
                    type: createdTweet.type,
                    idTweetOriginal: createdTweet.idTweetOriginal,
                    likes: [],
                    reTweet: [],
                    tweetOriginal: null
                }]
            })
        })

    })
    describe('listTweetByID - GET', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).get("/tweets")

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })

        test('Deve retornar "Tweet não encontrado" quando for passado o id de um tweet inexistente', async () => {
            const { token } = await makeToken()

            const response = await request(server).get(`/tweets/${randomUUID()}`).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                ok: false,
                code: 404,
                message: "Tweet não encontrado"
            })
        })

        test('Deve retornar um tweet quando for passado o id do tweet a ser retornado', async () => {
            const { token, createdUser } = await makeToken()

            const createdTweet = await makeTweet(createdUser.id, createdUser.username)
            const response = await request(server).get(`/tweets/${createdTweet.id}`).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                ok: true,
                code: 200,
                message: "Tweet listado com sucesso",
                data: {
                    id: createdTweet.id,
                    content: createdTweet.content,
                    idUser: createdTweet.idUser,
                    authorTweet: createdTweet.authorTweet,
                    type: createdTweet.type,
                    idTweetOriginal: createdTweet.idTweetOriginal,
                    likes: [],
                    reTweet: []
                }
            })
        })
    })
    describe('updateTweet - PUT', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).put(`/tweets/${"any_id"}`)

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })

        test('Deve retornar "Tweet para editar não encontrado" caso seja passado o id de um tweet inexistente"', async () => {
            const { token } = await makeToken()
            const response = await request(server).put(`/tweets/${randomUUID()}`).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                ok: false,
                code: 404,
                message: "Tweet para editar não encontrado"
            })
        })

        test('Deve retornar "Você não tem permissão para editar esse tweet" caso o id do usuario logado seja diferente do id do autor do tweet', async () => {
            const { token } = await makeToken()
            const otherUser = await makeOtherUser()
            const otherTweet = await makeTweet(otherUser.id, otherUser.username)

            const response = await request(server).put(`/tweets/${otherTweet.id}`).send("any_content").set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(403)
            expect(response.body).toEqual({
                ok: false,
                code: 403,
                message: "Você não tem permissão para editar esse tweet"
            })
        })

        test('Deve retornar "Tweet atualizado com sucesso" ao passar informações para editar um tweet', async () => {
            const { token, createdUser } = await makeToken()
            const createdTweet = await makeTweet(createdUser.id, createdUser.username)

            const response = await request(server).put(`/tweets/${createdTweet.id}`).send("any_content").set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                ok: true,
                code: 200,
                message: "Tweet atualizado com sucesso",
                data: {
                    id: expect.any(String),
                    content: expect.any(String),
                    idUser: expect.any(String),
                    authorTweet: expect.any(String),
                    type: expect.any(String),
                    idTweetOriginal: null,
                }
            })
        })
    })
    describe('deleteTweet - DELETE', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).delete(`/tweets/${"any_id"}`)

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })

        test('Deve retornar "Tweet não encontrado" caso seja passado o id de um Tweet inexistente', async () => {
            const { token } = await makeToken()
            const response = await request(server).delete(`/tweets/${randomUUID()}`).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                ok: false,
                code: 404,
                message: "Tweet não encontrado"
            })
        })

        test('Deve retornar "Você não tem permissão para deletar esse tweet" caso o id do usuario logado seja diferente do id do autor do tweet ', async () => {
            const { token } = await makeToken()
            const otherUser = await makeOtherUser()
            const otherTweet = await makeTweet(otherUser.id, otherUser.username)

            const response = await request(server).delete(`/tweets/${otherTweet.id}`).set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(403)
            expect(response.body).toEqual({
                ok: false,
                code: 403,
                message: "Você não tem permissão para deletar esse tweet"
            })
        })
        test('Deve retornar "Tweet deletado com sucesso" quando for passado o id do Tweet a deletar', async () => {
            const { token, createdUser } = await makeToken()
            const createdTweet = await makeTweet(createdUser.id, createdUser.username)

            const response = await request(server).delete(`/tweets/${createdTweet.id}`).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                ok: true,
                code: 200,
                message: 'Tweet deletado com sucesso',
            })
        })
    })
})