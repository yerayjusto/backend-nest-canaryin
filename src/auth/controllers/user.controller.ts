import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Request, Get, Res, Param, Query, Body, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../services/user.service';
import { multerOptions } from '../helpers/image-storage';
import { map, Observable, of, switchMap } from 'rxjs';
import { User } from './models/user.class';
import { FriendRequest, FriendRequestStatus, FriendRequest_Status } from './models/friend-request.interface';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('profile/:id')
    profile(@Param('id') id: number): Observable<string> {
        return this.userService.findImageNameByUserId(id);
    }

    //@UseGuards(AuthGuard('jwt'))
    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    uploadImage(@UploadedFile() file,@Param('id') id: number ): Observable<{ modifiedFileName: string } | {error: string}> {
    const fileName = file?.filename;
    const userId = id;
    return this.userService.updateUserImageById(userId, fileName).pipe(
        switchMap(() => 
        of({
            modifiedFileName: file.filename,
        })),
    );
    }

    //@UseGuards(AuthGuard('jwt'))
    @Get('image')
    findImage(@Request() req, @Res() res): Observable<Object> {
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe(
            switchMap((imageName: string) => {
                return of(res.sendFile(imageName, {root: './images'}));
            }),
        )
    }

    //@UseGuards(AuthGuard('jwt'))
    @Get('image-name')
    findUserImageName(@Request() req, @Res() res): Observable<{imageName: string}> {
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe(
            switchMap((imageName: string) => {
                return of({ imageName });
            }),
        )
    }

    @Post('refreshtoken/:id')
    refreshtoken(@Param() params): Observable<{ token: string }> {
        return this.userService.refreshtoken(params.id).pipe(map((jwt: string) => ({ token: jwt })))
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':userId')
    findUserById(@Param('userId') userStrId: string): Observable<User> {
        const userId = parseInt(userStrId);
        return this.userService.findUserById(userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('friend-request/send/:receiverId')
    sendConnRequest(
        @Param('receiverId') receiverId: number,
        @Request() req, 
        ): Observable<FriendRequest | { error: string }> {
        return this.userService.sendFriendRequest(receiverId, req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('friend-request/status/:receiverId')
    getFriendRequestStatus(
        @Param('receiverId') receiverId: number,
        @Request() req,
        ): Observable<FriendRequestStatus> {
        return this.userService.getFriendRequestStatus(receiverId, req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('friend-request/response/:friendRequestId')
    respondToFriendRequest(
        @Param('friendRequestId') friendRequestId: number,
        @Body() statusResponse: FriendRequestStatus
        ): Observable<FriendRequestStatus> {
        return this.userService.respondToFriendRequest(friendRequestId, statusResponse.status);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('friend-request/me/received-requests')
    getFriendRequestsFromRecipients(
        @Request() req,
        ): Observable<FriendRequestStatus[]> {
        return this.userService.getFriendRequestsFromRecipients(req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('friends/my')
    getFriends(
        @Request() req,
        ): Observable<User[]> {
        return this.userService.getFriends(req.user);
    }
}
