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


    public async createUser(data: CreateUserDto): Promise<ResponseDto> {
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
                message: "Username ou email já cadastrado"
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
                id: data.id,
                avatar: data.avatar,
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password
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
            message: "Usuario excluido com sucesso",
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