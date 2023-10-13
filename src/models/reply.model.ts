import { v4 as createUuid } from 'uuid'
import { Liker } from "./liker.model";
import { User } from './user.model';

export class Reply {
    protected tweetReplyId: string;
    public likes: Liker[];
    public authorReply: string;
    public authorTweet: string;
    public tweetOriginalId: string
    public contentTweetReply: string;

    constructor(tweetOriginalId: string, authorTweet: string, authorReply: string, contentTweetReply: string) {
        this.tweetReplyId = createUuid()
        this.authorReply = authorReply
        this.authorTweet = authorTweet
        this.tweetOriginalId = tweetOriginalId;
        this.contentTweetReply = contentTweetReply;
        this.likes = [];
    }

    public getIdReply() {
        return this.tweetReplyId
    }

    public includeLikeReply(tweet: Liker) {
        this.likes.push(tweet)
    }

    public removeLikeReply(likeId: Liker) {
        const index = this.likes.findIndex(item => item.likedId === likeId.likedId)
        if (index !== -1) {
            this.likes.splice(index, 1)
        }
    }


    public detailReplie() {
        return {
            id: this.getIdReply(),
            authorReply: this.authorReply,
            contentTweetReply: this.contentTweetReply,
            replyTo: this.authorTweet
        }
    }
}