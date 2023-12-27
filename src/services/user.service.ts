import prisma from "../database/prisma.database";
import { ResponseDto } from "../dto/response.dto";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { User } from "../models/user.model";
import { User as UserPrisma } from "@prisma/client"
import bcrypt from 'bcrypt'

class UserService {
    public async listAllUsers(): Promise<ResponseDto> {
        const data = await prisma.user.findMany()

        const listUserModel = data.map((item) => this.mapToModel(item))

        return {
            ok: true,
            code: 200,
            message: "Usuarios listados com sucesso",
            data: listUserModel.map((item) => item.detailUser())
        }
    }

    public async getByUser(username: string) {
        const user = await prisma.user.findUnique({
            where: {
                username: username,
            }
        })
        return user
    }

    public async getById(idUser: string): Promise<ResponseDto> {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: idUser
                }
            })

            if (!user) {
                return {
                    ok: false,
                    code: 404,
                    message: "Usuario não encontrado"
                }
            }
            return {
                ok: true,
                code: 200,
                message: "Usuario listado com sucesso",
                data: user
            }
        } catch (error: any) {
            return {
                ok: false,
                code: 500,
                message: "Erro interno do servidor",
            }
        }

    }

    public async getByToken(token: string) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    token: token
                }
            })

            if (!user) {
                return {
                    ok: false,
                    code: 404,
                    message: "token não encontrado"
                }
            }
            return {
                ok: true,
                code: 200,
                message: "Usuario listado com sucesso",
                data: user
            }
        } catch (error) {
            return {
                ok: false,
                code: 500,
                message: "Erro interno do servidor"
            }
        }
    }

    public async getUserByUsername(username: string): Promise<ResponseDto> {
        const user = await prisma.user.findUnique({
            where: {
                username: username,
            }
        })
        return {
            ok: true,
            code: 200,
            message: 'Usuario listado com sucesso',
            data: user
        }
    }


    public async createUser(data: CreateUserDto): Promise<ResponseDto> {
        if (data.name.length > 18) {
            return {
                ok: false,
                code: 400,
                message: "nome deve ter no máximo 18 caracteres."
            };
        }

        if (data.username.length > 16) {
            return {
                ok: false,
                code: 400,
                message: "username deve ter no máximo 16 caracteres."
            };
        }

        const findUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: data.username },
                    { email: data.email }
                ]
            }
        });

        if (findUser) {
            return {
                ok: false,
                code: 400,
                message: "Username ou email já cadastrado."
            }
        }

        const passwordHash = await bcrypt.hash(data.password, 10)
        const createUser = await prisma.user.create({
            data: {
                avatar: data.avatar,
                name: data.name,
                username: data.username,
                email: data.email,
                password: passwordHash
            }
        });

        return {
            ok: true,
            code: 201,
            message: "Usuário cadastrado com sucesso",
            data: createUser
        };
    }


    public async updateUser(data: UpdateUserDto) {

        // const passwordHash = await bcrypt.hash(data?.password!, 10)
        const userFind = await prisma.user.findUnique({
            where: {
                id: data.id
            }
        })

        if (!userFind) {
            return {
                ok: false,
                code: 404,
                message: "Usuario não existe"
            }
        }

        const updated = await prisma.user.update({
            where: {
                id: data.id
            },
            data: {
                avatar: data.avatar,
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password,
                token: data.token
            }
        })

        return {
            ok: true,
            code: 200,
            message: "Usuario atualizado com sucesso",
            data: updated
        }
    }

    public async deleteUser(id: string): Promise<ResponseDto> {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            }
        })

        if (!user) {
            return {
                ok: false,
                code: 404,
                message: "Usuario não encontrado"
            }
        }

        const deleted = await prisma.user.delete({
            where: {
                id: id
            }
        })

        return {
            ok: true,
            code: 200,
            message: "usuario excluido com sucesso",
            data: this.mapToModel(deleted).detailUser()
        }
    }

    public mapToModel(user: UserPrisma): User {
        const model = new User(
            user.id,
            user.avatar,
            user.name,
            user.username,
            user.email,
            user.password
        )
        return model
    }

}


export default new UserService()