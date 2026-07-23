
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { ApiStdResponses } from "../../config/swagger/api-response.decorator";
import { Token } from "../../common/token.decorator";
import { UserType } from "../../common/enum/user.enum";
import { ChatBasicRequestDto } from "./dto/chat-basic.dto";
import { ChatAdminMassgeDataResponseDto } from "./dto/data/chat-message-list-data.dto";
import { ChatSendRequestDto } from "./dto/chat-send.dto";
import { ChatAdminSendResponseDto } from "./dto/data/chat-send-data.dto";
import { ChatMessageReadRequestDto } from "./dto/chat-mesage-read.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";

@ApiTags('관리자 - 채팅 관련')
@Controller('/admin/chat')
export class ChatController {
    
    constructor(
        private readonly chatService: ChatService,
    ) {}

    @Post('/')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '채팅 리스트 ',
        description: '채팅 리스트',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
    })
    async chatList(
        @Body() dto: any,
        @Token(UserType.ADMIN) token:any
    ) {
        return await this.chatService.getList(dto, token);
    }

    @Post('/messages')
        @HttpCode(HttpStatus.OK)
        @ApiStdResponses({
            summary: '채팅내역 조회',
            description: '유저/파트너 상담 메세지 내역 조회',
            okExampleCode: 'SUCCESS',
            okExampleMessage: '요청 성공',
            okDataDto:ChatAdminMassgeDataResponseDto,
            requestBodyDtos: [ChatBasicRequestDto],
        })
        async getChatMessagesList(
            @Body() dto: ChatBasicRequestDto,
            @Token('ADMIN') token:any
        ) {
            return await this.chatService.getMessageList(dto, token)
        }


    @Post('/ban/word/list')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '채팅 리스트 ',
        description: '채팅 리스트',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
    })
    async bannedWordList(@Body() dto: any) {
        
        return await this.chatService.bannedWordList(dto);
    }
    
    @Post('/ban/word/create')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '채팅 리스트 ',
        description: '채팅 리스트',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
    })
    async bannedWordCreate(@Body() dto: any, @Token("ADMIN") token :any) {
        return await this.chatService.bannedWordCreate(dto, token);
    }
    
    @Delete('/ban/word/delete')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '채팅 리스트 ',
        description: '채팅 리스트',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
    })
    async bannedWordDelete(@Body() dto: any, @Token("ADMIN") token :any) {
        console.log(dto )
        return await this.chatService.bannedWordDelete(dto);
    }

    @Post('/send')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '채팅내역 조회',
        description: '유저/파트너 상담 메세지 전송',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: ChatAdminSendResponseDto,
        requestBodyDtos: [ChatSendRequestDto],
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
        @Body() dto: ChatSendRequestDto,
        @Token('ADMIN') token:any,
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
        requestBodyDtos: [ChatMessageReadRequestDto],
    })
    async readChatMessage(
        @Body() dto: ChatMessageReadRequestDto,
        @Token(UserType.ADMIN) token:any
    ) {
        return await this.chatService.readMessage(dto, token)
    }
}