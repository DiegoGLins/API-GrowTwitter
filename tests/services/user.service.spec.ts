import { User } from '@prisma/client'
import UserService from '../../src/services/user.service'
import { prismaMock } from '../config/prisma.mock'
import { v4 as createUuid } from 'uuid'

describe('User service', () => {
    const createSut = () => {
        return UserService
    }

    describe('listAllUsers', () => {
        test('Deve retornar a lista de usuarios, contendo um usuário', async () => {
            const sut = createSut()

            prismaMock.user.findMany.mockResolvedValue([{
                id: "any_uuid",
                avatar: "any_avatar",
                name: "any_name",
                username: "any_username",
                email: "any_email",
                password: "any_password"
            }])

            const result = await sut.listAllUsers()

            expect(result).toHaveProperty("ok", true)
            expect(result).toHaveProperty("code", 200)
            expect(result).toHaveProperty("message", "Usuarios listados com sucesso")
            expect(result.data).toHaveLength(1)
            result.data.map((item: any) => {
                expect(item).toHaveProperty("id", "any_uuid")
                expect(item).toHaveProperty("avatar", "any_avatar")
                expect(item).toHaveProperty("name", "any_name")
                expect(item).toHaveProperty("username", "any_username")
                expect(item).toHaveProperty("email", "any_email")
            })
        })
    })
    describe('getByUser', () => {
        test.only('Deve retornar um usuário com o username passado como parâmetro', async () => {
            const sut = createSut()
            prismaMock.user.findUnique.mockResolvedValue({
                id: createUuid(),
                avatar: "any_avatar",
                name: "any_name",
                username: "username",
                email: "any_email",
                password: "any_password"
            } as User)

            const result = await sut.getByUser("any_username")

            expect(result).toHaveProperty("username", expect.any(String))
        })
    })

    describe('createUser', () => {
        test.only('Deve retornar a mensagem: "Username ou email já cadastrado", quando já houver um usuario cadastrado com email ou username passado ', async () => {
            const sut = createSut()

            prismaMock.user.findFirst.mockResolvedValue({
                id: "any_id",
                avatar: "any_avatar",
                name: "any_name",
                username: "any_username",
                email: "any_email",
                password: "any_password"
            })

            await expect(sut.createUser({
                email: "any_email",
                name: "any_name",
                password: "any_password",
                username: "any_username"
            })).rejects.toThrow("Username ou email já cadastrado")
        })
    })

})