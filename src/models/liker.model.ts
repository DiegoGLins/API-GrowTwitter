import { v4 as createUuid } from 'uuid'
import { Follow } from '../types/FollowUserType';

export class Liker {
    public likedId: string;
    public authorlike: Follow
    public tweetLiked: string
    constructor(tweetLiked: string, authorlike: Follow) {
        this.tweetLiked = tweetLiked;
        this.likedId = createUuid();
        this.authorlike = authorlike
    }
}
