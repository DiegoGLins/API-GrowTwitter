export interface UpdateTweetDto {
    idUser: string;
    idTweet: string;
    content?: string
}

export interface FoundTweetDto {
    idUser: string;
    idTweet: string
}

export interface CreateTweetDto {
    id?: string,
    content: string,
    idUser: string,
    authorTweet: string,
    type: string;
    idTweetOriginal?: string
}