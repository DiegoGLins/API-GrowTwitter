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

    // -------- Detalhe do seguidor ---------//

    public detailFollow() {
        return {
            id: this._id,
            name: this.name,
            username: this.username,
            email: this.email,
            following: this.following,
            tweets: [...this.tweets]
        };
    }

    //--- Seguindo e deixar de seguir ---//

    public addFollowing(user: Follow) {
        this.following.push(user);
        return this.following.length
    }

    public unFollowing(user: Follow) {
        const index = this.following.findIndex((item) => item.id === user.id);
        if (index !== -1) {
            this.following.splice(index, 1);
            return this.following.length;
        }
    }

    //----------- Feed ---------------//

    public showFeed() {
        const listTweets = this.tweets.filter(item => item.detailTweet())
        return listTweets
    }

    //----------- Seguindo -----------//

    public followingUser(user: Follow) {
        if (user === undefined) {
            console.log("Usuario precisa ser diferente de vazio");
            return;
        }

        if (this._id === user.id) {
            console.log("Você não pode seguir a si mesmo!");
            return;
        }

        const alreadyFollowing = this.following.some((item) => item.id === user.id);
        if (alreadyFollowing) {
            console.log(`@${this.username}, você já está seguindo o usuario @${user.username}`);
            return;
        }

        this.addFollowing(user);
        console.log(`@${this.username} começou seguir @${user.username}`);
        this.detailFollow()
    }

    public unFollowingUser(user: Follow) {
        if (user === undefined) {
            console.log("Usuario precisa ser diferente de vazio");
            return;
        }

        if (this.detailFollow().id === user.id) {
            console.log("Você não pode deixar de seguir a si mesmo!");
            return;
        }

        const isFollowing = this.following.some((item) => item.id === user.id);
        if (!isFollowing) {
            console.log(`@${user.username} não faz parte da lista que você segue`);
            return;
        }

        this.unFollowing(user);
        console.log(`@${this.username} deixou de seguir @${user.username} `);
        return this.detailFollow();
    }

}
