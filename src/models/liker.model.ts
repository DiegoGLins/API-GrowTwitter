export class Liker {
    public idTweet?: string
    public idAuthorTweet: string
    public idAuthorLike: string
    public authorLike: string;
    public contentTweetLiked: string
    constructor(private _idLike: string, idAuthorTweet: string, idAuthorLike: string, authorLike: string, contentTweetLiked: string, idTweet?: string) {
        this.idTweet = idTweet;
        this.idAuthorTweet = idAuthorTweet
        this.idAuthorLike = idAuthorLike
        this.authorLike = authorLike
        this.contentTweetLiked = contentTweetLiked

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
        }
    }

}
