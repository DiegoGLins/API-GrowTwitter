export interface CreateLikeDto {
    idTweet?: string | null | undefined
    idAuthorTweet?: string;
    idAuthorLike: string;
    authorLike: string;
    contentTweetLiked?: string;
}

export interface CreateLikeReTweetDto {
    idLike?: string
    idReTweet?: string | null | undefined
    idAuthorReTweet?: string
    idAuthorLike: string;
    authorLike: string;
    contentReTweet?: string
}


