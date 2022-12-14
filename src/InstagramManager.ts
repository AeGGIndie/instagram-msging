import {
    AccountRepositoryLoginResponseLogged_in_user,
    DirectRepositoryCreateGroupThreadResponseRootObject,
    DirectThreadEntity,
    IgApiClient,
    StatusResponse,
    DirectThreadRepositoryBroadcastResponsePayload,
    DirectThreadRepositoryBroadcastResponseRootObject,
    DirectInboxFeedResponseThreadsItem,
} from "instagram-private-api";
import {MinimalThreadItem} from "./MinimalThreadItem";
import {FriendshipStatus} from "./interfaces";
import {User} from "./User";

export class InstagramManager {
    private username: string = "";
    private password: string = "";
    private ig: IgApiClient;

    constructor(username: string, password: string) {
        if (!username || !password) {
            throw new Error("upon creation, username OR password was not set correctly");
        }
        this.username = username;
        this.password = password;

        this.ig = new IgApiClient();
        this.ig.state.generateDevice(this.username);
    }

    // Setters for Username and password
    public setUsername(userToSet: string): void {
        if (!userToSet) {
            throw new Error("username was not provided");
        }
        this.username = userToSet;
    }

    public setPassword(passwordToSet: string): void {
        if (!passwordToSet) {
            throw new Error("password was not provided");
        }
        this.password = passwordToSet;
    }

    // Logging In
    public async init(): Promise<AccountRepositoryLoginResponseLogged_in_user> {
        return await this.ig.account.login(
            this.username,
            this.password,
        );
    }

    // Logging Out
    public async exit(): Promise<StatusResponse> {
        return await this.ig.account.logout();
    }


    // Method to message users/group chats
    public async sendDirectMessage(userToMessage: string, messageToSend: string): Promise<DirectThreadRepositoryBroadcastResponsePayload | DirectThreadRepositoryBroadcastResponseRootObject> {
        const userId: number = await this.ig.user.getIdByUsername(userToMessage);

        const userThread: DirectRepositoryCreateGroupThreadResponseRootObject = await this.ig.direct.createGroupThread([userId.toString()], userToMessage);
        const threadInstance: DirectThreadEntity = new DirectThreadEntity(this.ig);
        threadInstance.threadId = userThread.thread_id;
        return await threadInstance.broadcastText(messageToSend);
    }

    // Gets the first 20 people that have recently messaged the user
    public async fetchRecentDMs(): Promise<DirectInboxFeedResponseThreadsItem[]> {
        return await this.ig.feed.directInbox().items()
    }

    /*
    * Filters the first 20 people that have recently messaged the user into
    * a MinimalThreadItem object
    */
    public async fetchRecentMinimal(): Promise<MinimalThreadItem[]> {
        const recentDMs = await this.fetchRecentDMs();
        return recentDMs.map(dm => new MinimalThreadItem(dm.thread_title, dm.thread_id, (dm as any).read_state != 0, dm.users.map(user => new User(user.pk, user.username, user.profile_pic_id, ((user as any).friendship_status) as FriendshipStatus, (user as any).pk_id))));
    }

    public async sendGroupMessage(): Promise<void> {

    }


}

