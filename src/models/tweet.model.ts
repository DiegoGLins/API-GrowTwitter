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
}

export default Tweet