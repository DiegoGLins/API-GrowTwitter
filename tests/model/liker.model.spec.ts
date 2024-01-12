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
})