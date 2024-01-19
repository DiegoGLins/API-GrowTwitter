import jwt from 'jsonwebtoken'
import prisma from '../../src/database/prisma.database'
import request from 'supertest'
import { createServer } from '../../src/express.server'
import { TweetType } from '../../src/types/TweetType'
import { randomUUID } from 'crypto'

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

describe('ReTweets Routes', () => {
    let server: any = createServer()
    beforeEach(async () => {
        await prisma.tweet.deleteMany()
        await prisma.user.deleteMany()
        await prisma.$disconnect()
    })

    afterAll(async () => {
        await prisma.tweet.deleteMany()
        await prisma.user.deleteMany()
        await prisma.$disconnect()
    })

    describe('createReTweet - POST', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).post(`/reTweets`).send()

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })

        test('Deve retornar "Tweet para responder não encontrado" caso seja passado o id de um tweet inexistente', async () => {
            const { token } = await makeToken()

            const response = await request(server).post('/reTweets').send({ content: "any_content", idTweetOriginal: randomUUID() }).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                ok: false,
                code: 404,
                message: "Tweet para responder não encontrado"
            })
        })

        test('Deve criar um Retweet no banco', async () => {
            const { token, createdUser } = await makeToken()
            const otherUser = await makeOtherUser()
            const otherTweet = await makeTweet(otherUser.id, otherUser.username)

            const response = await request(server).post('/reTweets').send({ content: "any_content", idTweetOriginal: otherTweet.id }).set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(201)
            expect(response.body).toEqual({
                ok: true,
                code: 201,
                message: "Tweet criado com sucesso",
                data: {
                    id: expect.any(String),
                    content: expect.any(String),
                    idUser: createdUser.id,
                    authorTweet: expect.any(String),
                    type: TweetType.reTweet,
                    idTweetOriginal: otherTweet.id,
                    likes: [],
                    reTweet: [],
                    tweetOriginal: expect.any(Object),
                    user: expect.any(Object)
                }
            })
        })
    })
})
