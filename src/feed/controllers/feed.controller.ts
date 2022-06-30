import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, Res, UseGuards } from "@nestjs/common";
import { Observable } from "rxjs";
import { DeleteResult, UpdateResult } from "typeorm";
import { FeedPost } from "../models/post.interface";
import { FeedService } from "../services/feed.service";
import { IsCreatorGuard } from "../guards/is-creator.guard";
import { AuthGuard } from "@nestjs/passport";

@Controller("feed")
export class FeedController {
  constructor(private feedService: FeedService) {}

  //@Roles(Role.ADMIN, Role.PREMIUM)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() post: FeedPost, @Request() req): Observable<FeedPost> {
    return this.feedService.createPost(req.user, post);
  }

  // @Get()
  // findAll(): Observable<FeedPost[]> {
  //   return this.feedService.findAllPosts();
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findSelected(@Query("userId") userId: number, @Query("take") take = 1, @Query("skip") skip = 1): Observable<FeedPost[]> {
    take = take > 20 ? 20 : take;
    return this.feedService.findPosts(take, skip);
  }

  @UseGuards(AuthGuard('jwt'), IsCreatorGuard)
  @Put(":id")
  update(@Param("id") id: number, @Body() feedPost: FeedPost): Observable<UpdateResult> {
    return this.feedService.updatePost(id, feedPost);
  }

  @UseGuards(AuthGuard('jwt'), IsCreatorGuard)
  @Delete(":id")
  delete(@Param("id") id: number): Observable<DeleteResult> {
    return this.feedService.deletePost(id);
  }

  @Get('image/:fileName')
  findImageByName(@Param('fileName') fileName: string, @Res() res) {
    if (!fileName || ['null', '[null]'].includes(fileName)) return;
    return res.sendFile(fileName, {root: './images'});
  }
}
