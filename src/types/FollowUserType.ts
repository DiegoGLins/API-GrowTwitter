import { ReTweet } from "@prisma/client";
import Tweet from "../models/tweet.model";
export interface Follow {
    id: string;
    name: string;
    username: string;
    email: string;
    tweets: Tweet[]
    reTweet: ReTweet[]
}