import { Liker } from "./liker.model";

export class ReTweet {
    public likes: Liker[];
    public idUserReTweet: string;
    public idTweetOriginal: string;
    public contentReTweet: string;
    public contentTweetOriginal: string;

    constructor(idTweetOriginal: string, contentTweetOriginal: string, idUserReTweet: string, contentReTweet: string, private _idReTweet: string) {
        this.contentTweetOriginal = contentTweetOriginal
        this.idUserReTweet = idUserReTweet;
        this.idTweetOriginal = idTweetOriginal;
        this.contentReTweet = contentReTweet;
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
            idReTweet: this._idReTweet,
            idUserReTweet: this.idUserReTweet,
            contentReTweet: this.contentReTweet,
        }
    }
}