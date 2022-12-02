import {FriendshipStatus} from "./interfaces";

export class User {
    public pk: number;
    public username: string;
    public profilePicURL?: string;
    public friendshipStatus: FriendshipStatus;
    public pkId?: string;

    constructor(pk: number, username: string, profilePicURL: string | undefined, friendshipStatus: FriendshipStatus, pkId: string | undefined) {
        this.pk = pk;
        this.username = username;
        this.profilePicURL = profilePicURL;
        this.friendshipStatus = friendshipStatus;
        this.pkId = pkId;
    }

}