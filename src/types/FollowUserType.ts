import { Reply } from "../models/reply.model";
import Tweet from "../models/tweet.model";
export interface Follow {
    id: string;
    name: string;
    username: string;
    email: string;
    tweets: Tweet[]
    replie: Reply[]
}