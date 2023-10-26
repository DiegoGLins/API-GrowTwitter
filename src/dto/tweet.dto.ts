export interface TweetDto {
    content: string;
    idUser: string
    authorTweet: string
}
export interface UpdateTweetDto {
    idUser: string;
    idTweet: string;
    content?: string
}

export interface FoundTweetDto {
    idUser: string;
    idTweet: string
}