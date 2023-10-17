export interface CreateReTweetDto {
    idTweetOriginal: string,
    contentTweetOriginal: string,
    idUserReTweet: string,
    contentReTweet: string,
}


export interface UpdateReTweetDto {
    idUserReTweet: string;
    idReTweet: string;
    contentReTweet?: string
}

export interface FoundReTweetDto {
    idUserReTweet: string;
    idReTweet: string
}