import {User} from "./User";

export class MinimalThreadItem {
    public threadTitle: string;
    public hasNewMessages: boolean;
    public threadId: string;
    public users: User[];


    constructor(threadTitle: string, threadId: string, hasNewMessages: boolean = false, users: User[]) {
        this.threadTitle = threadTitle;
        this.threadId = threadId;
        this.hasNewMessages = hasNewMessages;
        this.users = users;
    }


}