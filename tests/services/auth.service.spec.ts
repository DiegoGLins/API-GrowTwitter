import UserService from '../../src/services/user.service'
import AuthService from '../../src/services/auth.service'
import { prismaMock } from '../config/prisma.mock'
import bcrypt, { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../../src/models/user.model'

describe('AuthService', () => {
    const createSut = () => {
        return { AuthService, UserService }
    }

    describe('login', () => {
        test('Deve retornar a mensagem: "Usuario não encontrado" caso o username passado não exista', async () => {
            const sut = createSut()

            prismaMock.user.findUnique.mockResolvedValue(null)

            const result = await sut.AuthService.login('nonexistent_user', 'password');

            expect(result).toEqual({
                ok: false,
                code: 404,
                message: 'Usuario não encontrado',
            });
        })

        test('Deve retornar a mensagem: "Username ou senha incorretos" quando comparado uma hash e um password true', async () => {
            const sut = createSut()

            const userData = {
                id: "any_id",
                avatar: "any_avatar",
                name: "any_name",
                username: "any_username",
                email: "any_email",
                password: "any_password"
            };

            jest.spyOn(UserService, 'getByUser').mockResolvedValue(userData);

            const mockBcryptCompare = jest.fn().mockResolvedValue('');
            jest.spyOn(bcrypt, 'compare').mockImplementation(mockBcryptCompare);

            const result = await sut.AuthService.login('any_username', 'invalid_password');
            console.log(result)
            expect(result).toEqual({
                ok: false,
                code: 401,
                message: 'Username ou senha incorretos'
            });

            expect(UserService.getByUser).toHaveBeenCalledWith('any_username');
            expect(mockBcryptCompare).toHaveBeenCalledWith('invalid_password', 'any_password');
        })

        test('Deve retornar todos os dados do usuario logado e o token, execeto a senha', async () => {
            const sut = createSut()

            const userData = {
                id: "any_id",
                avatar: "any_avatar",
                name: "any_name",
                username: "any_username",
                email: "any_email",
                password: "any_password"
            };

            jest.spyOn(UserService, 'getByUser').mockResolvedValue(userData);

            const mockBcryptCompare = jest.fn().mockReturnValue(true);

            bcrypt.compare = mockBcryptCompare
            const mockJwt = jest.fn().mockReturnValue('any_token')
            jwt.sign = mockJwt

            const result = await sut.AuthService.login('any_username', 'any_password');

            expect(result).toEqual({
                ok: true,
                code: 200,
                message: 'Login realizado com sucesso',
                data: {
                    authHeader: {
                        id: "any_id",
                        name: "any_name",
                        username: "any_username",
                        avatar: "any_avatar",
                        email: "any_email"
                    },
                    token: "any_token"
                }
            });
        })
    })
})