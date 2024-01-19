import prisma from '../../src/database/prisma.database'
import request from 'supertest'
import { createServer } from '../../src/express.server'
import bcrypt from 'bcrypt'

const makeUser = async () => {
    const hashPassword = await bcrypt.hash("any_password", 10)
    const user = await prisma.user.create({
        data: {
            name: "any_name",
            username: "any_username",
            email: "any_email",
            password: hashPassword
        }
    })
    return user
}

describe('Auth Routes', () => {
    const server = createServer()

    beforeEach(async () => {
        await prisma.user.deleteMany();
        await prisma.$disconnect()
    });

    afterEach(async () => {
        await prisma.user.deleteMany();
        await prisma.$disconnect()
    });

    describe('login - POST', () => {
        test('Deve retornar "username ou password não fornecidos" caso não seja passado um dos campos no body', async () => {
            const response = await request(server).post(`/auth/login`).send({ username: 'any_username' })

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                ok: false,
                code: 400,
                message: "username ou password não fornecidos"
            })
        })

        test('Deve retornar "Usuario não encontrado" caso o usuario não esteja cadastrado no banco', async () => {

            const response = await request(server).post(`/auth/login`).send({ username: 'any_username', password: "any_password" })

            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                ok: false,
                code: 404,
                message: "Usuario não encontrado"
            })
        })

        test('Deve retornar "Username ou senha incorretos" caso seja passado password errado', async () => {
            await makeUser()
            const response = await request(server).post(`/auth/login`).send({ username: "any_username", password: "other_password" })
            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                ok: false,
                code: 401,
                message: "Username ou senha incorretos"
            })
        })

        test('Deve retornar "Login realizado com sucesso" e os dados do usuario logado + o token', async () => {
            const createdUser = await makeUser()
            const response = await request(server).post(`/auth/login`).send({ username: "any_username", password: "any_password" })

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                ok: true,
                code: 200,
                message: "Login realizado com sucesso",
                data: {
                    authHeader: {
                        id: createdUser.id,
                        name: createdUser.name,
                        username: createdUser.username,
                        avatar: createdUser.avatar,
                        email: createdUser.email,
                    },
                    token: expect.any(String)
                }
            })
        })
    })
})