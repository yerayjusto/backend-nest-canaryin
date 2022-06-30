import { Module } from '@nestjs/common';
import { FeedService } from './services/feed.service';
import { FeedController } from './controllers/feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPostEntity } from './models/post.entity';
import { AuthModule } from '../auth/auth.module';
import { IsCreatorGuard } from './guards/is-creator.guard';
import { UserService } from 'src/auth/services/user.service';
import { UserEntity } from 'src/auth/controllers/models/user.entity';
import { JwtService } from '@nestjs/jwt';
import { FriendRequestEntity } from 'src/auth/controllers/models/friend-request.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([FeedPostEntity, UserEntity, FriendRequestEntity])],
  providers: [FeedService, IsCreatorGuard, UserService, { provide: JwtService, useValue: {} }],
  controllers: [FeedController],
})
export class FeedModule {}
