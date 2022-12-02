export interface FriendshipStatus {
    following: boolean;
    blocking: boolean;
    isPrivate: boolean;
    incomingRequest: boolean;
    outgoingRequest: boolean;
    isBestie: boolean;
    isRestricted: boolean;
    reachabilityStatus: boolean;
    isFeedFavorite: boolean;
}