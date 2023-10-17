import { Liker } from "./liker.model";
import { ReTweet } from "./reTweet.model";
class Tweet {
    public idUser: string;
    public likes: Liker[];
    public reTweets: ReTweet[];
    public content: string;
    public authorTweet: string

    constructor(private _id: string, content: string, idUser: string, authorTweet: string) {
        this.authorTweet = authorTweet
        this.content = content
        this.idUser = idUser;
        this.likes = [];
        this.reTweets = [];
    }

    public get id() {
        return this._id;
    }

    //----- Inclui e remove e likes ------

    public includeLike(tweet: Liker) {
        this.likes.push(tweet)
    }

    public removeLike(like: Liker) {
        const index = this.likes.findIndex(item => item.idLike === like.idLike)
        if (index !== -1) {
            this.likes.splice(index, 1)
        }
    }

    detailTweet() {
        return {
            idTweet: this._id,
            content: this.content,
            idUser: this.idUser,
            likes: this.likes.length,
            reTweet: this.reTweets.length
        }
    }

    detailTweetCreate() {
        return {
            idTweet: this._id,
            content: this.content,
            idUser: this.idUser,
            authorTweet: this.authorTweet
        }
    }
}

export default Tweet