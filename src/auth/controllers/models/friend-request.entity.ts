import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FriendRequest_Status } from "./friend-request.interface";
import { UserEntity } from "./user.entity";

@Entity("request")
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentFriendRequest)
  creator: UserEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.receivedFriendRequest)
  receiver: UserEntity;

  @Column()
  status: FriendRequest_Status;
}
