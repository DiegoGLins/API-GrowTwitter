import { Follow } from '@prisma/client'
import FollowService from '../../src/services/follow.service'
import { prismaMock } from '../config/prisma.mock'

describe('FollowService', () => {
    const createSut = () => {
        return FollowService
    }

    describe('listFollows', () => {
        test('Deve retornar a lista de usuários seguidos ou um array vazio caso não tenha esteja seguindo nenhum usuário', async () => {
            const sut = createSut();

            prismaMock.follow.findMany.mockResolvedValue([{
                id: "any_id",
                idUserFollowing: "any_idFollowing",
                usernameFollowing: "any_usernameFollowing",
                idUserFollower: "any_idUserFollower",
                usernameFollower: "any_usernmaeFollower"
            }] as Follow[] || []);

            const result = await sut.listFollows('any_user_id');

            expect(result).toEqual({
                ok: true,
                code: 200,
                message: "Lista dos usuarios que você segue atualizada com sucesso",
                data: [{
                    id: "any_id",
                    idUserFollowing: "any_idFollowing",
                    usernameFollowing: "any_usernameFollowing",
                    idUserFollower: "any_idUserFollower",
                    usernameFollower: "any_usernmaeFollower"
                }] || []
            });
        });
    })
})