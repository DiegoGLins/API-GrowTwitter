import { Liker } from "./liker.model";
import { ReTweet } from "./reTweet.model";
class Tweet {
    public idUser: string;
    public likes: Liker[];
    public reTweets: ReTweet[];
    public content: string;
    public authorTweet: string

    constructor(private _id: string, content: string, idUser: string, authorTweet: string) {
        this.authorTweet = authorTweet
        this.content = content
        this.idUser = idUser;
        this.likes = [];
        this.reTweets = [];
    }

    public get id() {
        return this._id;
    }

    //----- Inclui e remove e likes ------

    public includeLike(tweet: Liker) {
        this.likes.push(tweet)
    }

    public removeLike(like: Liker) {
        const index = this.likes.findIndex(item => item.idLike === like.idLike)
        if (index !== -1) {
            this.likes.splice(index, 1)
        }
    }

    detailTweet() {
        return {
            idTweet: this._id,
            content: this.content,
            idUser: this.idUser,
            authorTweet: this.authorTweet,
            likes: this.likes.length,
            reTweet: this.reTweets.length
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

    // // public feedTweet(tweet: string, user: Follow) {
    // //     const findTweet = tweets.find(item => item.content === tweet)
    // //     const findReply = replies.find(item => item.authorReply.id === user.id)


    // //     if (findTweet) {
    // //         if (findTweet?.likes.length === 0) {
    // //             console.log(`@${user.username} : ${findTweet?.content}`)
    // //             console.log(`[ ${findTweet.likes.length} curtidas ]`)
    // //             console.log("=========================================================================")
    // //         }

    // //         if (findTweet!.likes.length === 1) {
    // //             console.log(`@${findTweet?.detailTweet().author} : ${findTweet?.content}`)
    // //             console.log(`[ @${findTweet!.likes.map(item => item.authorlike.username)} curtiu isso ]`)
    // //             console.log("=========================================================================")

    // //         }

    // //         if (findTweet!.likes.length >= 2) {
    // //             console.log(`@${findTweet?.detailTweet().author} : ${findTweet?.content} `)
    // //             console.log(`[ @${findTweet!.likes[0].authorlike.username} e mais ${findTweet?.likes.length - 1} curtiram ]`)
    // //             console.log("=========================================================================")
    // //         }

    // //         if (findTweet) {
    // //             if (findTweet.replies.length) {
    // //                 console.log(`@${findTweet.detailTweet().author} : ${findTweet.content}`)
    // //                 console.log(`> @${findTweet.replies.find(item => item.authorReply.username)}: ${findTweet.replies.find(item => item.contentTweetReply)}\n likes: ${findTweet.replies.find(item => item.likes.length)}`)
    // //                 console.log("=========================================================================")
    // //             }
    // //         }
    // //     }


    // //     if (findReply) {
    // //         if (findReply.likes.length === 0) {
    // //             console.log(`@${findReply.authorTweet.username} : ${findReply!.contentTweetReply}`)
    // //             console.log(`[ ${findReply.likes.length} curtidas ]`)
    // //             console.log("=========================================================================")
    // //         }

    // //         else if (findReply.likes.length === 1) {
    // //             console.log(`@${findReply.authorTweet.username} : ${findReply!.contentTweetReply}`)
    // //             console.log(`[ @${findReply!.likes.map(item => item.authorlike.username)} curtiu isso ]`)
    // //             console.log("=========================================================================")
    // //         }

    // //         else if (findReply.likes.length >= 2) {
    // //             console.log(`@${findReply.authorTweet.username} : ${findReply!.contentTweetReply} `)
    // //             console.log(`[ @${findReply!.likes[0].authorlike.username} e outros ${findReply!.likes.length - 1} curtiram ]`)
    // //             console.log("=========================================================================")
    // //         }
    // //     }

    // //     if (findReply) {
    // //         for (const reply of replies) {
    // //             const authorTweet = reply.authorReply.username
    // //             const contentTweet = reply.detailReplie().replyTo?.content
    // //             const authorReply = reply.authorTweet.username
    // //             const content = reply.contentTweetReply
    // //             const likes = reply.likes.length
    // //             console.log(`@${authorTweet} : ${contentTweet}`)
    // //             console.log(`> @${authorReply}: ${content}\n [ ${likes} likes ] \n [ ${replies.length - 1} replies ]`)
    // //             console.log("=========================================================================")
    // //         }
    // //     }
    // }

}

export default Tweet