// export interface TweetDto {
//     idTweetOriginal?: string
//     idReTweet?: string | null
//     idUser: string
//     authorTweet: string
//     content: string;
//     tipo: string
// }
// export interface ReTweetDto {
//     idReTweet?: string;
//     idTweetOriginal?: string
//     idUserReTweet: string;
//     authorReTweet?: string
//     content: string
//     tipo?: string
// }

// export interface FoundTweetDto {
//     idUser: string;
//     idTweet: string
// }

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