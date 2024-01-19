import { Follow } from '@prisma/client'
import FollowService from '../../src/services/follow.service'
import UserService from '../../src/services/user.service'
import { prismaMock } from '../config/prisma.mock'
import { CreateFollowDto } from '../../src/dto/follow.dto'

describe('FollowService', () => {
    const createSut = () => {
        return { FollowService, UserService }
    }

    describe('listFollows', () => {
        test('Deve retornar a lista de usuários seguidos ou um array vazio caso não tenha esteja seguindo nenhum usuário', async () => {
            const sut = createSut();

            prismaMock.follow.findMany.mockResolvedValue([] as Follow[]);

            const result = await sut.FollowService.listFollows('any_user_id');

            expect(result).toEqual({
                ok: true,
                code: 200,
                message: "Lista dos usuarios que você segue atualizada com sucesso",
                data: [] as Follow[]
            });
        })
    })

    describe('addFollowing', () => {
        test('Deve retornar a mensagem: "Usuário não encontrado" caso não seja informado o id ou o username do usuario que quer seguir ', async () => {
            const sut = createSut()

            prismaMock.follow.findUnique.mockResolvedValue(null)

            prismaMock.follow.create.mockResolvedValue({
                id: "any_id",
                idUserFollowing: "any_idUserFollowing",
                usernameFollowing: "any_usernameFollowing",
                idUserFollower: "any_idUserFollower",
                usernameFollower: "any_usernameFollower"
            })
            const result = await sut.FollowService.addFollowing({} as CreateFollowDto)

            expect(result).toEqual({
                ok: false,
                code: 404,
                message: "Usuario não encontrado"
            })
        })

        test('Deve retornar a mensagem: "Você não pode seguir a si mesmo" caso o id do usuario que quer seguir seja igual ao id do usuario logado', async () => {
            const sut = createSut()

            prismaMock.user.findUnique.mockResolvedValue({
                id: "any_id",
                avatar: "any_avatar",
                name: "any_name",
                username: "any_username",
                email: "any_email",
                password: "any_password"
            });

            const result = await sut.FollowService.addFollowing({
                idUserFollowing: "any_idUserFollowing",
                usernameFollowing: "any_usernameFollowing",
                idUserFollower: "any_id",
                usernameFollower: "any_username",
            })

            expect(result).toEqual({
                ok: false,
                code: 400,
                message: "Você não pode seguir a si mesmo"
            })
        })

        test('Deve retornar "Você já está seguindo o usuário nome_do_usuario_seguido" se já estiver seguindo o usuário', async () => {
            const sut = createSut();

            prismaMock.user.findUnique.mockResolvedValue({
                id: "any_id",
                avatar: "any_avatar",
                name: "any_name",
                username: "any_username",
                email: "any_email",
                password: "any_password"
            });

            prismaMock.follow.findFirst.mockResolvedValue({
                id: "any_follow_id",
                idUserFollowing: "any_idUserFollowing",
                usernameFollowing: "any_usernameFollowing",
                idUserFollower: "other_id",
                usernameFollower: "other_username",
            });

            const result = await sut.FollowService.addFollowing({
                idUserFollowing: "any_idUserFollowing",
                usernameFollowing: "any_usernameFollowing",
                idUserFollower: "other_id",
                usernameFollower: "other_username",
            });

            expect(result).toEqual({
                ok: false,
                code: 400,
                message: `Você já está seguindo o usuário ${"any_usernameFollowing"}`,
            });
        });

    })
    describe('deleteFollow', () => {
        test('Deve retornar "Usuario não encontrado" se o usuário não estiver sendo seguido', async () => {
            const sut = createSut();

            prismaMock.follow.findUnique.mockResolvedValue(null);

            const result = await sut.FollowService.deleteFollow('any_username', 'any_id');

            expect(result).toEqual({
                ok: false,
                code: 404,
                message: 'Usuario não encontrado',
            });
        });

        test('Deve retornar "Voce deixou de seguir nome_do_usuario_seguido" e os dados do usuário seguido se o usuário estiver sendo seguido', async () => {
            const sut = createSut();

            prismaMock.follow.findUnique.mockResolvedValue({
                id: "any_follow_id",
                idUserFollowing: "any_idUserFollowing",
                usernameFollowing: "any_usernameFollowing",
                idUserFollower: "other_id",
                usernameFollower: "other_username",
            });

            prismaMock.follow.delete.mockResolvedValue({
                id: "any_follow_id",
                idUserFollowing: "any_idUserFollowing",
                usernameFollowing: "any_usernameFollowing",
                idUserFollower: "other_id",
                usernameFollower: "other_username",
            });

            const result = await sut.FollowService.deleteFollow('any_usernameFollowing', 'any_idUserFollowing');

            expect(result).toEqual({
                ok: true,
                code: 200,
                message: `Voce deixou de seguir ${"any_usernameFollowing"}`,
                data: {
                    id: "any_follow_id",
                    idUserFollowing: "any_idUserFollowing",
                    usernameFollowing: "any_usernameFollowing",
                    idUserFollower: "other_id",
                    usernameFollower: "other_username",
                },
            });
        });
    });
})