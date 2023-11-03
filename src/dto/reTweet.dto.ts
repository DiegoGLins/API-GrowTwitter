
export interface CreateReTweetDto {
    idTweetOriginal: string,
    idReTweet: string;
    contentTweetOriginal?: string,
    idUserReTweet: string,
    contentReTweet: string,
    authorReTweet: string
}
export interface UpdateReTweetDto {
    idUserReTweet: string;
    idReTweet: string
    contentReTweet?: string
}

export interface FoundReTweetDto {
    idUserReTweet: string;
    idReTweet: string
}