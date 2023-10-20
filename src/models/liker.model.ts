export class Liker {
    public idTweet?: string
    public idAuthorTweet: string
    public idAuthorLike: string
    public idReTweet?: string;
    public idAuthorReTweet?: string;
    public authorLike: string;
    public contentTweetLiked: string
    public contentReTweet: string
    constructor(private _idLike: string, idAuthorLike: string, authorLike: string, contentTweetLiked: string, contentReTweet: string, idAuthorTweet: string, idTweet?: string, idAuthorReTweet?: string, idReTweet?: string) {
        this._idLike = _idLike
        this.idTweet = idTweet;
        this.idAuthorTweet = idAuthorTweet
        this.idAuthorLike = idAuthorLike
        this.idReTweet = idReTweet
        this.authorLike = authorLike
        this.idAuthorReTweet = idAuthorReTweet
        this.contentTweetLiked = contentTweetLiked
        this.contentReTweet = contentReTweet
    }


    public get idLike() {
        return this._idLike
    }

    public detailLike() {
        return {
            idLike: this._idLike,
            idTweet: this.idTweet,
            idAuthorTweet: this.idAuthorTweet,
            idAuthorLike: this.idAuthorLike,
            authorLike: this.authorLike,
            contentTweetLiked: this.contentTweetLiked,
            contentReTweet: this.contentReTweet
        }
    }

}
