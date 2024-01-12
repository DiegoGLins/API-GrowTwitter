import Tweet from "./tweet.model";
import { Follow } from "../types/FollowUserType";

export class User implements Follow {
    public following: Follow[];
    public tweets: Tweet[]

    constructor(
        private _id: string,
        public avatar: string,
        public name: string,
        public username: string,
        public email: string,
        private _password: string,
    ) {
        this.username = username;
        this._password = _password;
        this.following = [];
        this.tweets = []
    }

    //------ getters------

    public getId(): string {
        return this._id;
    }

    public getPassword(): string {
        return this._password;
    }

    //------ setters --------

    public setId(id: string) {
        this._id = id;
    }

    public setPassword(password: string) {
        this._password = password;
    }

    //---- Detalhe do usuario -----//

    public detailUser() {
        return {
            id: this._id,
            avatar: this.avatar,
            name: this.name,
            username: this.username,
            email: this.email
        }
    }
}


