import { Liker } from '../../src/models/liker.model'

describe('Liker Model', () => {
    const createSut = () => {
        return new Liker("any_idLike", "any_idAuthorTweet", "any_idAuthorLike", "any_authorLike", "any_contentTweetLiked", "any_idTweet")
    }

    test('Deve retornar o id do Like', () => {
        const sut = createSut()

        const result = sut.getIdLike()

        expect(result).toBe("any_idLike")
    })

    test.only('Deve retornar todas as informações do tweet curtido', () => {
        const sut = createSut()

        const result = sut.detailLike()

        expect(result).toBeDefined()
        expect(result).toHaveProperty("idLike", expect.any(String))
        expect(result).toHaveProperty("idAuthorTweet", "any_idAuthorTweet")
        expect(result).toHaveProperty("idAuthorLike", "any_idAuthorLike")
        expect(result).toHaveProperty("authorLike", "any_authorLike")
        expect(result).toHaveProperty("contentTweetLiked", "any_contentTweetLiked")
    })
})