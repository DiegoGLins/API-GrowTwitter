import { TweetType } from "../types/TweetType";

class Tweet {
    public idUser: string;
    public content: string;
    public authorTweet: string
    public idTweetOriginal?: string;
    public avatar: string;
    public type: TweetType
    //  id?: string,
    //content: string,
    //idUser: string,
    //authorTweet: string,
    //type: string;
    //idTweetOriginal?: string

    constructor(private _id: string, content: string, idUser: string, authorTweet: string, type: TweetType, idTweetOriginal?: string) {
        this.avatar = ''
        this.authorTweet = authorTweet
        this.content = content
        this.idTweetOriginal = idTweetOriginal
        this.idUser = idUser;
        this.type = type
    }
    // "idTweet": "221a641b-cb17-4777-850d-a4a80d601e8b",
    //"content": "N",
    //"type": "N",
    //"idUser": "Essa nova rede social é muito massa",
    //"authorTweet": "e5c2f752-290f-4e7f-b2c3-80b2b4278eef"

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