import { Liker } from "./liker.model";
import { Reply } from "./reply.model";

class Tweet {
    public idUser: string;
    public likes: Liker[];
    public replies: Reply[];
    public content: string

    constructor(private id: string, content: string, idUser: string) {
        this.idUser = idUser;
        this.content = content
        this.likes = [];
        this.replies = [];
    }

    public getId() {
        return this.id;
    }

    //----- Inclui e remove e likes ------

    public includeLike(tweet: Liker) {
        this.likes.push(tweet)
    }

    public removeLike(likeId: Liker) {
        const index = this.likes.findIndex(item => item.likedId === likeId.likedId)
        if (index !== -1) {
            this.likes.splice(index, 1)
        }
    }

    detailTweet() {
        return {
            author: this.idUser,
            content: this.content,
            likes: this.likes.length,
            reply: this.replies.length
        }
    }

    detailTweetCreate() {
        return {
            idTweet: this.getId(),
            author: this.idUser,
            content: this.content,
        }
    }
}

export default Tweet