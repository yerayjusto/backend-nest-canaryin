import { User } from '../../auth/controllers/models/user.class';

export interface FeedPost {
  id?: number;
  body?: string;
  createdAt?: Date;
  author?: User;
}
