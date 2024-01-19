import { createServer } from '../../src/express.server'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import prisma from '../../src/database/prisma.database'
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

describe('User Routes ', () => {
    let server: any = createServer()

    beforeEach(async () => {
        await prisma.user.deleteMany()
        await prisma.tweet.deleteMany()
    })

    afterAll(async () => {
        await prisma.user.deleteMany()
        await prisma.tweet.deleteMany()
    })

    describe('List - GET', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).get("/users")

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })
        test('Deve retornar "JsonWebTokenError: jwt must be provided", quando for informado um token inválido', async () => {
            const response = await request(server).get("/users").set("Authorization", "any_token")

            expect(response.status).toBe(500)
            expect(response.body).toEqual(
                {
                    "message": "JsonWebTokenError: jwt must be provided"
                }
            )
        })
        test('Deve retornar a lista contendo um usuário no banco', async () => {
            const token = makeToken()
            await makeUser()

            const response = await request(server).get("/users").set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                ok: true,
                code: 200,
                message: "Usuarios listados com sucesso",
                data: [{
                    id: expect.any(String),
                    avatar: expect.any(String),
                    name: "any_name",
                    username: "any_username",
                    email: "any_email"
                }]
            })
        })
    })
    describe('Register - POST', () => {
        test('Deve retornar: "Por favor informe todos os campos" caso algum campo não seja passado', async () => {
            const user = {
                name: "any_name",
                username: "any_username",
                password: "any_password"
            }

            const response = await request(server).post("/users").send({ data: user })
            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                "ok": false,
                "code": 400,
                "message": "Por favor informe todos os campos"
            })
        })
        test('Deve retornar o dados de um usuário criado, exceto a senha', async () => {
            const user = {
                name: "any_name",
                username: "any_username",
                email: "any_email",
                password: "any_password"
            }

            const response = await request(server).post("/users").send(user)
            expect(response.status).toBe(201)
            expect(response.body).toEqual({
                id: expect.any(String),
                avatar: expect.any(String),
                name: "any_name",
                username: "any_username",
                email: "any_email"
            })
        })
    })
    describe('Delete - DELETE', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).delete(`/users/${"any_id"}`)

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })

        test('Deve retornar "Usuario não encontrado" caso seja passado um id inexistente', async () => {
            const token = makeToken()

            const response = await request(server).delete(`/users/${randomUUID()}`).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                ok: false,
                code: 404,
                message: "Usuario não encontrado"
            })
        })
        test('Deve retornar "Usuario excluido com sucesso" quando o id passado existir no banco', async () => {
            const token = makeToken()
            const userCreated = await makeUser()

            const response = await request(server).delete(`/users/${userCreated.id}`).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                ok: true,
                code: 200,
                message: "Usuario excluido com sucesso",
                data: {
                    id: expect.any(String),
                    avatar: expect.any(String),
                    name: "any_name",
                    username: "any_username",
                    email: "any_email"
                }
            })
        })
    })
    describe('Update - PUT', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).put(`/users/${"any_id"}`)

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })

        test('Deve retornar "Usuario não existe" caso seja passado um id inexistente', async () => {
            const token = makeToken()

            const response = await request(server).put(`/users/${randomUUID()}`).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                ok: false,
                code: 404,
                message: "Usuario não existe"
            })
        })

        test('Deve retornar "Usuario atualizado com sucesso" ao passar os dados a serem editados', async () => {
            const token = makeToken()

            const createdUser = await makeUser()

            const user = {
                name: "edited_name",
                username: "edited_username",
            }

            const response = await request(server).put(`/users/${createdUser.id}`).send(user).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                ok: true,
                code: 200,
                message: "Usuario atualizado com sucesso",
                data: {
                    id: expect.any(String),
                    avatar: expect.any(String),
                    name: expect.any(String),
                    username: expect.any(String),
                    email: expect.any(String)
                }
            })
        })
    })
})