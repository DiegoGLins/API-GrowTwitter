import jwt from 'jsonwebtoken'
import prisma from '../../src/database/prisma.database'
import request from 'supertest'
import { createServer } from '../../src/express.server'
import { randomUUID } from 'crypto'

const makeToken = () => {
    const authHeader = {
        id: "any_id",
        name: "any_name",
        username: "any_username"
    }
    const token = jwt.sign(authHeader, `${process.env.SECRET_WORD}`, {
        expiresIn: "8hr"
    })

    return token
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

const makeTweet = async () => {
    const tweet = await prisma.tweet.create({
        data: {
            id: randomUUID(),
            content: "any_content",
            idUser: randomUUID(),
            authorTweet: "any_author",
            type: "any_type",
            idTweetOriginal: null
        }
    })
    return tweet
}

describe('Tweets Routes', () => {
    const server = createServer()

    beforeEach(async () => {
        await prisma.user.deleteMany()
        await prisma.tweet.deleteMany()
    })

    describe('listTweetsFromUser', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).get("/users")

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })

        test.only('Deve retornar a lista de tweet do usuario logado contendo um tweet', async () => {
            const token = makeToken()
            const createdUser = await makeUser()
            const createdTweet = await makeTweet()

            await prisma.tweet.update({
                where: {
                    id: createdTweet.id,
                },
                data: {
                    idUser: createdUser.id,
                },
            });
            const response = await request(server).get(`/tweets/fromUser`).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(200)
            expect(response.body.ok).toBe(true);
            expect(response.body.code).toBe(200);
            expect(response.body.message).toBe("Tweets listados com sucesso");
            expect(response.body.data).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: createdTweet.id,
                        content: createdTweet.content,
                        idUser: createdUser.id,
                        authorTweet: createdTweet.authorTweet,
                        type: createdTweet.type,
                        idTweetOriginal: createdTweet.idTweetOriginal,
                    }),
                ])
            );
        })
    })
    describe('createTweet', () => {
        test('', () => {

        })
    })
    describe('listAllTweets', () => {
    })
    describe('listTweetByID', () => {
    })
    describe('updateTweet', () => {
    })
    describe('deleteTweet', () => {
    })
})