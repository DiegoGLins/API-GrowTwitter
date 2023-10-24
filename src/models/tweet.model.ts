import { Liker } from "./liker.model";
import { ReTweet } from "./reTweet.model";
class Tweet {
    public idUser: string;
    public reTweets: ReTweet[];
    public content: string;
    public authorTweet: string

    constructor(private _id: string, content: string, idUser: string, authorTweet: string) {
        this.authorTweet = authorTweet
        this.content = content
        this.idUser = idUser;
        this.reTweets = [];
    }

    public get id() {
        return this._id;
    }

    detailTweet() {
        return {
            idTweet: this._id,
            content: this.content,
            idUser: this.idUser,
            authorTweet: this.authorTweet,
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