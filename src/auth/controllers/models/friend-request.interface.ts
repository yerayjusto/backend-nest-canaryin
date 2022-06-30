import { User } from "./user.class";

export type FriendRequest_Status = 'not-sent' | 'pending' | 'accepted' | 'declined' | 'waiting';

export interface FriendRequestStatus {

  status?: FriendRequest_Status;
}

export interface FriendRequest {
  id?: number;
  status?: FriendRequest_Status;
  receiver?: User;
  creator?: User;
}