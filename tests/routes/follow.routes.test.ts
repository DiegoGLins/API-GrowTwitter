import jwt from 'jsonwebtoken'
import prisma from '../../src/database/prisma.database'
import request from 'supertest'
import { createServer } from '../../src/express.server'
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

const makeFollow = async () => {
    const userLogged = await makeToken()
    const userFollowing = await makeOtherUser()
    const following = await prisma.follow.create({
        data: {
            id: randomUUID(),
            idUserFollowing: userFollowing.id,
            idUserFollower: userLogged.createdUser.id,
            usernameFollowing: userFollowing.username,
            usernameFollower: userLogged.createdUser.username
        }
    })

    return { following, userLogged }
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

describe('Follow Routes', () => {
    let server: any = createServer()

    beforeEach(async () => {
        await prisma.follow.deleteMany()
        await prisma.user.deleteMany()
    })

    afterAll(async () => {
        await prisma.follow.deleteMany()
        await prisma.user.deleteMany()
    })

    describe('list - GET', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).get("/follows")

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })

        test('Deve retornar a lista de usuarios seguidos pelo usuário logado', async () => {
            const { userLogged, following } = await makeFollow()

            const response = await request(server).get(`/follows`).set("Authorization", `Bearer ${userLogged.token}`)
            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                ok: true,
                code: 200,
                message: "Lista dos usuarios que você segue atualizada com sucesso",
                data: [{
                    id: expect.any(String),
                    idUserFollowing: following.idUserFollowing,
                    usernameFollowing: following.usernameFollowing,
                    idUserFollower: userLogged.createdUser.id,
                    usernameFollower: userLogged.createdUser.username
                }]
            })
        })
    })

    describe('addFollow - POST', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).post(`/follows/${"any_id"}`)

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })

        test('Deve retornar "Usuario não encontrado" caso seja passado o username de um usuario inexistente no body', async () => {
            const { token } = await makeToken()
            const otherUser = await makeOtherUser()

            const response = await request(server).post(`/follows/${otherUser.id}`).send({ usernameFollowing: "any_username" }).set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                ok: false,
                code: 404,
                message: "Usuario não encontrado"
            })
        })

        test.only('Deve retornar "Você já está seguindo o usuário "nome_do_usuário_seguido" caso o usuario logado tente seguir o mesmo usuario"', async () => {
            const { following, userLogged } = await makeFollow()
            const response = await request(server).post(`/follows/${following.idUserFollowing}`).send({ usernameFollowing: following.usernameFollowing }).set("Authorization", `Bearer ${userLogged.token}`)
            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                ok: false,
                code: 400,
                message: `Você já está seguindo o usuário ${following.usernameFollowing}`
            })
        })

        test('Deve retornar "Você não pode seguir a si mesmo" caso o id do usuário a seguir seja igual ao id do usuário logado', async () => {
            const { token, createdUser } = await makeToken()

            const response = await request(server).post(`/follows/${createdUser.id}`).send({ usernameFollowing: createdUser.username }).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                ok: false,
                code: 400,
                message: "Você não pode seguir a si mesmo"
            })
        })

        test('Deve retornar "Você começou seguir o usuário "nome_do_usuario_seguido" com os dados do seguido e do seguidor', async () => {
            const { token, createdUser } = await makeToken()
            const otherUser = await makeOtherUser()

            const response = await request(server).post(`/follows/${otherUser.id}`).send({ usernameFollowing: otherUser.username }).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                ok: true,
                code: 200,
                message: `Você começou seguir o usuario ${otherUser.username}`,
                data: {
                    id: expect.any(String),
                    idUserFollowing: otherUser.id,
                    usernameFollowing: otherUser.username,
                    idUserFollower: createdUser.id,
                    usernameFollower: createdUser.username
                }
            })
        })
    })

    describe('deleteFollow - DELETE', () => {
        test('Deve retornar Autenticação do token falhou, quando não for informado token', async () => {
            const response = await request(server).delete(`/follows/${"any_id"}`)

            expect(response.status).toBe(401)
            expect(response.body).toEqual({
                code: 401,
                message: "Autenticação do token falhou"
            })
        })

        test('Deve retornar "Usuario não encontrado" caso o id ou username do usuario seguido não exista', async () => {
            const { following, userLogged } = await makeFollow()

            const response = await request(server).delete(`/follows/${randomUUID()}`).send({ usernameFollowing: following.usernameFollowing }).set("Authorization", `Bearer ${userLogged.token}`)

            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                ok: false,
                code: 404,
                message: "Usuario não encontrado"
            })
        })

        test('Deve retornar "Você deixou de seguir "nome_do_usuario_seguido"" e os dados do usuario que deixou de seguir"', async () => {
            const { following, userLogged } = await makeFollow()
            const response = await request(server).delete(`/follows/${following.idUserFollowing}`).send({ usernameFollowing: following.usernameFollowing }).set("Authorization", `Bearer ${userLogged.token}`)

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                ok: true,
                code: 200,
                message: `Voce deixou de seguir ${following.usernameFollowing}`,
                data: {
                    id: expect.any(String),
                    idUserFollowing: following.idUserFollowing,
                    usernameFollowing: following.usernameFollowing,
                    idUserFollower: userLogged.createdUser.id,
                    usernameFollower: userLogged.createdUser.username
                }
            })
        })
    })
})