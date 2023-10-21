import Tweet from "./tweet.model";
import { Follow } from "../types/FollowUserType";
import { ReTweet } from "@prisma/client";

export class User implements Follow {
    public following: Follow[];
    public tweets: Tweet[]
    public reTweet: ReTweet[]

    constructor(
        private _id: string,
        public name: string,
        public username: string,
        public email: string,
        private _password: string
    ) {
        this.username = username;
        this._password = _password;
        this.following = [];
        this.tweets = []
        this.reTweet = []
    }

    //------ getters------

    public get id(): string {
        return this._id;
    }

    public get password(): string {
        return this._password;
    }

    //------ setters --------

    public set id(id: string) {
        this._id = id;
    }

    public set password(password: string) {
        this._password = password;
    }

    //---- Detalhe do usuario -----//

    public detailUser() {
        return {
            id: this._id,
            name: this.name,
            username: this.username,
            email: this.email
        }
    }
}
