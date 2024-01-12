import { User } from '../../src/models/user.model'

describe("User Model", () => {
    const createSut = () => {
        return new User("any_id", "any_avatar", "any_name", "any_username", "any_email", "any_password")
    }

    test('Deve retornar o id do usuário', () => {
        const sut = createSut()

        const result = sut.getId()

        expect(result).toStrictEqual(expect.any(String))
    })
    test('Deve retornar o password do usuário', () => {
        const sut = createSut()

        const result = sut.getPassword()

        expect(result).toStrictEqual(expect.any(String))
    })

    test('Deve setar o id do usuário', () => {
        const sut = createSut()

        sut.setId("otherId")
        const result = sut.getId()

        expect(result).toBe("otherId")

    })
    test('Deve setar o password do usuário', () => {
        const sut = createSut()

        sut.setPassword("otherPassword")
        const result = sut.getPassword()

        expect(result).toBe("otherPassword")

    })

    test('Deve retornar o todas as informações do usuário exceto a senha', () => {
        const sut = createSut()

        const result = sut.detailUser()

        expect(result).toBeDefined()
        expect(result).toHaveProperty("id", expect.any(String))
        expect(result).toHaveProperty("avatar", "any_avatar")
        expect(result).toHaveProperty("name", "any_name")
        expect(result).toHaveProperty("username", "any_username")
        expect(result).toHaveProperty("email", "any_email")

    })
})