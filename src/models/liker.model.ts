import { v4 as createUuid } from 'uuid'
export class Liker {
    //  idLike String 
    //   idTweet String?
    //   idAuthorTweet String? 
    //   idReTweet String?
    //   idAuthorReTweet String? 
    //   idAuthorLike String 
    //   authorLike String 
    //   contentTweetLiked String @db.Text
    //   contentReTweet String @db.Text

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
        // "idLike": "f4b4147a-5ea9-4087-8da6-aa818df9f960",
        // "idTweet": "Essa nova rede social é top",
        // "idAuthorLike": "3f1e2786-f316-420d-b4c8-7e11eae1a7ab",
        // "authorLike": "e1e08ec1-2c7c-454a-96a2-ae10a074b82a",
        // "contentTweetLiked": "186b1228-90b8-4276-a2de-a12e1f01c63a",
        // "contentReTweet": "p@sales.paxeco"

    }

}
