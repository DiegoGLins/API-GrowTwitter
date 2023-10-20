export interface CreateLikeDto {
    idTweet?: string;
    idAuthorTweet?: string;
    idAuthorLike: string;
    authorLike: string;
    contentTweetLiked?: string;
}

export interface CreateLikeReTweetDto {
    idReTweet?: string;
    idAuthorReTweet?: string
    idAuthorLike: string;
    authorLike: string;
    contentReTweet?: string
}

export interface RemoveLikeDto {
    idLike: string;
    idTweet?: string;
    idReTweet?: string;
    idUser: string
}

