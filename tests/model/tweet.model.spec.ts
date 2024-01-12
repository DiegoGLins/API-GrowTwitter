import Tweet from "../../src/models/tweet.model"
import { TweetType } from "../../src/types/TweetType"

describe('Tweet Model', () => {
    const createSut = () => {
        return new Tweet("any_id", "any_content", "any_idUser", "any_authorTweet", TweetType.normal)
    }

    test('Deve retornar o id do Tweet', () => {
        const sut = createSut()

        const result = sut.getId()

        expect(result).toBe("any_id")
    })
})