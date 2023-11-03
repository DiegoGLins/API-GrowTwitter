import prisma from "../database/prisma.database";
import { ResponseDto } from "../dto/response.dto";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { User } from "../models/user.model";
import { User as UserPrisma } from "@prisma/client"

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

    public async getByUser(username: string, password: string) {
        const user = await prisma.user.findUnique({
            where: {
                username: username,
                password: password
            }
        })
        return user
    }

    public async getById(id: string): Promise<ResponseDto> {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })
        return {
            ok: true,
            code: 200,
            message: "Usuario listado com sucesso",
            data: this.mapToModel(user!).detailUser()
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


    public async getByToken(token: string) {
        const user = await prisma.user.findUnique({
            where: {
                token: token
            }
        })
        return {
            ok: true,
            code: 200,
            message: "Usuario listado com sucesso",
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

        const createUser = await prisma.user.create({
            data: {
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password
            }
        });

        return {
            ok: true,
            code: 201,
            message: "Usuário cadastrado com sucesso",
            data: this.mapToModel(createUser).detailUser()
        };
    }


    public async updateUser(data: UpdateUserDto) {

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
            data: this.mapToModel(updated).detailUser()
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
            user.name,
            user.username,
            user.email,
            user.password
        )
        return model
    }

}


export default new UserService()