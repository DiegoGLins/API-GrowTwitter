import prisma from "../database/prisma.database";
import { CreateFollowDto } from "../dto/follow.dto";
import { ResponseDto } from "../dto/response.dto";

class Follow {
    public async listFollows(idUser: string): Promise<ResponseDto> {
        const data = await prisma.follow.findMany({
            where: {
                idUserFollower: idUser
            }
        })

        return {
            ok: true,
            code: 200,
            message: "Lista dos usuarios que você segue atualizada com sucesso",
            data: data
        }
    }

    public async addFollowing(data: CreateFollowDto): Promise<ResponseDto> {
        const checkUser = await prisma.user.findUnique({
            where: {
                id: data.idUserFollowing,
                username: data.usernameFollowing
            }
        })

        if (!checkUser) {
            return {
                ok: false,
                code: 404,
                message: "Usuario não encontrado"
            }
        }

        if (checkUser.id === data.idUserFollower) {
            return {
                ok: false,
                code: 400,
                message: "Você não pode seguir a si mesmo"
            }
        }

        const checkFollowing = await prisma.follow.findFirst({
            where: {
                usernameFollowing: data.usernameFollowing,
                idUserFollowing: data.idUserFollowing
            }
        })

        if (checkFollowing) {
            return {
                ok: false,
                code: 400,
                message: `Você já está seguindo o usuário ${checkFollowing.usernameFollowing}`
            }
        }
        const addFollowing = await prisma.follow.create({
            data: {
                idUserFollowing: data.idUserFollowing,
                usernameFollowing: data.usernameFollowing,
                idUserFollower: data.idUserFollower,
                usernameFollower: data.usernameFollower
            }
        })
        return {
            ok: true,
            code: 200,
            message: `Você começou seguir o usuario ${data.usernameFollowing}`,
            data: addFollowing
        }
    }

    public async deleteFollow(username: string, id: string) {
        const findFollow = await prisma.follow.findUnique({
            where: {
                idUserFollowing: id,
                usernameFollowing: username
            }
        })
        if (!findFollow) {
            return {
                ok: false,
                code: 404,
                message: "Usuario não encontrado"
            }
        }
        const deleted = await prisma.follow.delete({
            where: {
                idUserFollowing: id
            }
        })

        return {
            ok: true,
            code: 200,
            message: `Voce deixou de seguir ${findFollow.usernameFollowing}`,
            data: deleted
        }
    }
}


export default new Follow()