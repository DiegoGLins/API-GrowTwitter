import { User } from '@prisma/client'
import UserService from '../../src/services/user.service'
import { prismaMock } from '../config/prisma.mock'
import { v4 as createUuid } from 'uuid'
import bcrypt from 'bcrypt'

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
        test('Deve retornar um usuário com o username passado como parâmetro', async () => {
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
        test('Deve retornar a mensagem: "Username ou email já cadastrado", quando já houver um usuario cadastrado com email ou username passado ', async () => {
            const sut = createSut()

            prismaMock.user.findFirst.mockResolvedValue({
                id: "any_id",
                avatar: "any_avatar",
                name: "any_name",
                username: "any_username",
                email: "any_email",
                password: "any_password"
            })

            prismaMock.user.create.mockResolvedValue({
                id: "any_id",
                avatar: "any_avatar",
                email: "any_email",
                name: "any_name",
                username: "any_username",
                password: "any_password"
            })

            const result = await sut.createUser({
                email: "any_email",
                name: "any_name",
                password: "any_password",
                username: "any_username"
            })

            expect(result.code).toEqual(400)
            expect(result.ok).toBeFalsy()
            expect(result.message).toEqual("Username ou email já cadastrado")
        })

        test('Deve retornar o usuario criado caso não exista nenhum email ou username igual cadastrado', async () => {
            const sut = createSut()

            prismaMock.user.findFirst.mockResolvedValue(null)
            const mockBcrypt = jest.fn().mockReturnValue("")

            bcrypt.hash = mockBcrypt
            prismaMock.user.create.mockResolvedValue({
                id: "any_id",
                avatar: "any_avatar",
                email: "any_email",
                name: "any_name",
                username: "any_username",
                password: "any_password"
            })

            const result = await sut.createUser({
                email: "any_email",
                name: "any_name",
                username: "any_username",
                password: "any_password"
            })

            expect(result.ok).toBeTruthy()
            expect(result.code).toEqual(201)
            expect(result.data).toHaveProperty("id", expect.any(String))
            expect(result.data).toHaveProperty("email", "any_email")
            expect(result.data).toHaveProperty("avatar", "any_avatar")
            expect(result.data).toHaveProperty("name", "any_name")
            expect(result.data).toHaveProperty("username", "any_username")

        })
    })

    describe('updateUser', () => {
        test('Deve retornar a mensagem "Usuario não existe" ao tentar buscar um usuario pelo id', async () => {
            const sut = createSut()

            prismaMock.user.findUnique.mockResolvedValue(null);

            const result = await sut.updateUser({
                id: "nonexistent_id",
                avatar: "any_avatar",
                name: "any_name",
                username: "username",
                email: "any_email",
                password: "any_password"
            })

            expect(result).toEqual({
                ok: false,
                code: 404,
                message: 'Usuario não existe',
            });
        })

        test('Deve retornar o usuario editado com a mensagem: "Usuario atualizado com sucesso"', async () => {
            const sut = createSut()
            prismaMock.user.findUnique.mockResolvedValue({
                id: "existent_id",
                avatar: "any_avatar",
                name: "any_name",
                username: "any_username",
                email: "any_email",
                password: "any_password"
            });

            prismaMock.user.update.mockResolvedValue({
                id: "existent_id",
                avatar: "any_avatar",
                name: "any_name",
                username: "any_username",
                email: "any_email",
                password: "any_password"
            })

            const result = await sut.updateUser({
                name: "new_name",
                email: "new_email",
            })

            expect(result).toEqual({
                ok: true,
                code: 200,
                message: "Usuario atualizado com sucesso",
                data: {
                    id: expect.any(String),
                    avatar: expect.any(String),
                    name: expect.any(String),
                    username: expect.any(String),
                    email: expect.any(String),
                }
            })
        })
    })
    describe('deleteUser', () => {
        test('Deve retornar a mensagem: "Usuario não encontrado" ao passar um id que não existe', async () => {
            const sut = createSut()

            prismaMock.user.findUnique.mockResolvedValue(null)

            prismaMock.user.delete.mockResolvedValue({
                id: "any_id",
                avatar: "any_avatar",
                email: "any_email",
                name: "any_name",
                username: "any_username",
                password: "any_password"
            })

            const result = await sut.deleteUser('nonexistent_id')

            expect(result).toEqual({
                ok: false,
                code: 404,
                message: "Usuario não encontrado"
            })
        })

        test('Deve retornar as informações do usuario excluido com a mensagem: "Usuario excluído com sucesso"', async () => {
            const sut = createSut()

            prismaMock.user.findUnique.mockResolvedValue({
                id: "any_id",
                avatar: "any_avatar",
                email: "any_email",
                name: "any_name",
                username: "any_username",
                password: "any_password"
            })

            prismaMock.user.delete.mockResolvedValue({
                id: "any_id",
                avatar: "any_avatar",
                email: "any_email",
                name: "any_name",
                username: "any_username",
                password: "any_password"
            })

            const result = await sut.deleteUser("any_id")
            expect(result).toEqual({
                ok: true,
                code: 200,
                message: "Usuario excluido com sucesso",
                data: {
                    id: "any_id",
                    avatar: "any_avatar",
                    name: "any_name",
                    username: "any_username",
                    email: "any_email"
                }
            })
        })
    })
})