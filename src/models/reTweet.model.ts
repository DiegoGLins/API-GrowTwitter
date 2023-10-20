import { Liker } from "./liker.model";

export class ReTweet {
    public likes: Liker[];
    public idUserReTweet: string;
    public idTweetOriginal: string;
    public authorTweetOriginal: string
    public contentReTweet: string;
    public contentTweetOriginal: string;
    public authorReTweet: string

    constructor(idTweetOriginal: string, contentTweetOriginal: string, authorTweetOriginal: string, idUserReTweet: string, contentReTweet: string, authorReTweet: string, private _idReTweet: string) {
        this.idTweetOriginal = idTweetOriginal;
        this.contentTweetOriginal = contentTweetOriginal
        this.authorTweetOriginal = authorTweetOriginal
        this.idUserReTweet = idUserReTweet;
        this.contentReTweet = contentReTweet;
        this.authorReTweet = authorReTweet
        this.likes = [];
    }

    public get idReTweet() {
        return this._idReTweet
    }

    public includeLikeReTweet(tweet: Liker) {
        this.likes.push(tweet)
    }

    public removeLikeReTweet(like: Liker) {
        const index = this.likes.findIndex(item => item.idLike === like.idLike)
        if (index !== -1) {
            this.likes.splice(index, 1)
        }
    }


    public detailReTweet() {
        return {
            idTweetOriginal: this.idTweetOriginal,
            contentTweetOriginal: this.contentTweetOriginal,
            authorTweetOriginal: this.authorTweetOriginal,
            idReTweet: this._idReTweet,
            idUserReTweet: this.idUserReTweet,
            contentReTweet: this.contentReTweet,
            authorReTweet: this.authorReTweet,
        }
    }
}