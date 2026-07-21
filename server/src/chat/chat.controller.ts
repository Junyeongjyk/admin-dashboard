import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Res, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiExcludeEndpoint, ApiTags } from "@nestjs/swagger";
import { TokenAuthGuard } from "../common/gaurds/token-auth.gaurds";
import { ApiStdResponses } from "../config/swagger/api-response.decorator";
import { Token } from "../common/token.decorator";
import { UserType } from "../common/enum/user.enum";
import { ChatClientService } from "./chat.service";
import { ChatListDataResponseDto } from "./dto/data/chat-list-data.dto";
import { ChatClientBasicRequestDto } from "./dto/chat-basic.dto";
import { ChatMassgeDataResponseDto } from "./dto/data/chat-message-list-data.dto";
import { ChatClientSendRequestDto } from "./dto/chat-send.dto.";
import { ChatSendResponseDto } from "./dto/data/chat-send-data.dto";
import { ChatClientMessageReadRequestDto } from "./dto/chat-mesage-read.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { Response  } from 'express';

@ApiTags('1:1채팅')
@Controller('chat')
@UseGuards(TokenAuthGuard)
export class ChatClientController {

    constructor(
        private readonly chatService: ChatClientService,
    ) {}

    @Post('/list')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '채팅 상대방 리스트',
        description: '유저/파트너 상대 리스트 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: ChatListDataResponseDto
        //requestBodyDtos: [PaymentRequestDto],
    })
    async getChatList(
        @Token([UserType.USER, UserType.PARTNER]) token:any
    ) {
        return await this.chatService.getList(token)
    }

    @Post('/messages')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '채팅내역 조회',
        description: '유저/파트너 상담 메세지 내역 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto:ChatMassgeDataResponseDto,
        requestBodyDtos: [ChatClientBasicRequestDto],
    })
    async getChatMessagesList(
        @Body() dto: ChatClientBasicRequestDto,
        @Token([UserType.USER, UserType.PARTNER]) token:any
    ) {
        return await this.chatService.getMessageList(dto, token)
    }

    @Post('/admin/messages')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '관리자 상담내역 조회',
        description: '유저/파트너 <-> 관리자 상탐 메세지 내역 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto:ChatMassgeDataResponseDto,
    })
    async getChatAdminMessagesList(
        @Token([UserType.USER, UserType.PARTNER]) token:any
    ) {
        return await this.chatService.getAdminMessageList(token)
    }

    @Post('/send')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '채팅 메세지전송',
        description: '유저/파트너 상탐 메세지 전송',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: ChatSendResponseDto,
        requestBodyDtos: [ChatClientSendRequestDto],
    })
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'chatFile', maxCount: 1 },
        ],
        {
            limits: {
                fileSize: 10 * 1024 * 1024, // 전체 최대치
            },
            fileFilter: (req, file, cb) => {
                cb(null, true); 
            }
        }),
    )
    async setChatMessage(
        @Body() dto: ChatClientSendRequestDto,
        @Token([UserType.USER, UserType.PARTNER]) token:any,
        @UploadedFiles()
        files: {
            chatFile?: Express.Multer.File[];
        }
    ) {
        const chatFile = files?.chatFile?.[0];
        return await this.chatService.sendMessage(dto, token, chatFile)
    }

    @Post('/read')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '채팅 메세지 단일 읽음여부 처리',
        description: '실사간 전송받은 메세지 읽음여부 처러',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [ChatClientMessageReadRequestDto],
    })
    async readChatMessage(
        @Body() dto: ChatClientMessageReadRequestDto,
        @Token([UserType.USER, UserType.PARTNER]) token:any
    ) {
        return await this.chatService.readMessage(dto, token)
    }

    @ApiExcludeEndpoint()
    @Get('/image-view/:id')
    async chatImageView(@Param('id') id: number, @Res() res: Response) {
        return await this.chatService.getImage(id, res)
    }

    @ApiExcludeEndpoint()
    @Get('/download/:id')
    async chatDownload(@Param('id') id: number, @Res() res: Response) {

        const { stream, originalName, mimeType, size } = await this.chatService.chatDownload(id)
        const encoded = encodeURIComponent(originalName!);

        res.setHeader('Content-Type', mimeType!);
        res.setHeader('Content-Length', size!);
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${encoded}"; filename*=UTF-8''${encoded}`,
        );

        stream.on('error', () => {
            if (!res.headersSent) res.status(404);
            res.end();
        });

        res.on('close', () => {
            stream.destroy();
        });

        stream.pipe(res);
    }
}