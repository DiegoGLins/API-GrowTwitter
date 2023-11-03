import { Liker } from "./liker.model";

export class ReTweet {
    public likes: Liker[];
    public idUserReTweet?: string;
    public idTweetOriginal: string;
    public authorTweetOriginal: string
    public contentReTweet: string;
    public contentTweetOriginal: string;
    public authorReTweet: string

    constructor(private _idReTweet: string, idTweetOriginal: string, contentTweetOriginal: string, authorTweetOriginal: string, contentReTweet: string, authorReTweet: string, idUserReTweet: string) {
        this.idTweetOriginal = idTweetOriginal;
        this.contentTweetOriginal = contentTweetOriginal
        this.authorTweetOriginal = authorTweetOriginal
        this.idUserReTweet = idUserReTweet;
        this.contentReTweet = contentReTweet;
        this.authorReTweet = authorReTweet
        this.likes = [];
    }

    public get id() {
        return this._idReTweet
    }

    public detailReTweet() {
        return {
            idTweetOriginal: this.idTweetOriginal,
            contentTweetOriginal: this.contentTweetOriginal,
            authorTweetOriginal: this.authorTweetOriginal,
            idReTweet: this._idReTweet,
            idUserReTweet: this.idUserReTweet,
            authorReTweet: this.authorReTweet,
            contentReTweet: this.contentReTweet,

        }
    }
}