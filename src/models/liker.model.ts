import { v4 as createUuid } from 'uuid'
import { Follow } from '../types/FollowUserType';

export class Liker {
    public idLike: string;
    public idUser: Follow
    public idTweet: string
    constructor(idTweet: string, idUser: Follow) {
        this.idTweet = idTweet;
        this.idLike = createUuid();
        this.idUser = idUser
    }
}
