export interface CreateLikeDto {
    idTweet: string;
    idAuthorTweet?: string;
    idAuthorLike: string;
    authorLike: string;
    contentTweetLiked?: string;
}

export interface ListLikeDto {
    idTweet: string;
    idAuthorTweet: string;
}



