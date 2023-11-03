import { TweetType } from "../types/TweetType";

class Tweet {
    public idUser: string;
    public content: string;
    public authorTweet: string
    public idTweetOriginal?: string;
    public avatar: string;
    public type: TweetType

    constructor(private _id: string, content: string, idUser: string, authorTweet: string, type: TweetType, idTweetOriginal?: string) {
        this.avatar = ''
        this.authorTweet = authorTweet
        this.content = content
        this.idTweetOriginal = idTweetOriginal
        this.idUser = idUser;
        this.type = type
    }
    public get id() {
        return this._id;
    }

    detailReTweet() {
        return {
            idTweet: this._id,
            content: this.content,
            idUser: this.idUser,
            authorTweet: this.authorTweet,
            idTweetOriginal: this.idTweetOriginal
        }
    }

    detailTweet() {
        return {
            idTweet: this._id,
            content: this.content,
            type: this.type,
            idUser: this.idUser,
            authorTweet: this.authorTweet
        }
    }
}

export default Tweet