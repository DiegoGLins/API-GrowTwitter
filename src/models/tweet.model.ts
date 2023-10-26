// import { TweetType } from "../types/TweetType";
// class Tweet {
//     public idUser: string;
//     public content: string;
//     public authorTweet: string;
//     public idReTweet?: string
//     public tipo: TweetType.normal | TweetType.reTweet

//     constructor(private _id: string, content: string, idUser: string, authorTweet: string, idReTweet?: string) {
//         this.idReTweet = idReTweet
//         this.authorTweet = authorTweet
//         this.content = content
//         this.idUser = idUser;
//         this.tipo = TweetType.normal || TweetType.reTweet
//     }

//     public get id() {
//         return this._id;
//     }

//     detailTweet() {
//         return {
//             id: this._id,
//             idReTweet: this.idReTweet,
//             content: this.content,
//             idUser: this.idUser,
//             authorTweet: this.authorTweet,
//             tipo: this.tipo
//         }
//     }
// }

// export default Tweet

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