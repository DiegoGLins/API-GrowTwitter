import repository from "../database/prisma.database";
import { ResponseDto } from "../dto/response.dto";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { User } from "../models/user.model";
import { User as UserPrisma } from "@prisma/client"

class UserService {

    public async listAllUsers(): Promise<ResponseDto> {
        const data = await repository.user.findMany()

        const listUserModel = data.map((item) => this.mapToModel(item))

        return {
            ok: true,
            code: 200,
            message: "Usuarios listados com sucesso",
            data: listUserModel.map((item) => item.detailUser())
        }
    }

    public async getByUser(name: string, username: string, email: string, password: string) {
        const user = await repository.user.findUnique({
            where: {
                name: name,
                username: username,
                password: password,
                email: email
            }
        })
        return user
    }

    public async createUser(data: CreateUserDto): Promise<ResponseDto> {

        const findUser = await repository.user.findUnique({
            where: {
                username: data.username,
                email: data.email
            }
        })

        if (!findUser) {
            const createUser = await repository.user.create({
                data: {
                    name: data.name,
                    username: data.username,
                    email: data.email,
                    password: data.password
                }
            })
            return {
                ok: true,
                code: 201,
                message: "Usuario cadastrado com sucesso",
                data: this.mapToModel(createUser).detailUser()
            }
        }

        return {
            ok: false,
            code: 400,
            message: "username ou email já cadastrado"
        }
    }

    public async updateUser(data: UpdateUserDto): Promise<ResponseDto> {

        const user = await repository.user.findUnique({
            where: {
                id: data.id
            }
        })

        if (!user) {
            return {
                ok: false,
                code: 404,
                message: "Usuario não existe"
            }
        }

        const atualizaUsuario = await repository.user.update({
            where: {
                id: data.id
            },
            data: {
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
            data: atualizaUsuario
        }
    }

    public async deleteUser(id: string): Promise<ResponseDto> {
        const user = await repository.user.findUnique({
            where: {
                id
            }
        })

        if (!user) {
            return {
                ok: false,
                code: 404,
                message: "Usuario não encontrado"
            }
        }

        await repository.user.delete({
            where: {
                id
            }
        })

        return {
            ok: true,
            code: 200,
            message: "usuario excluido com sucesso"
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