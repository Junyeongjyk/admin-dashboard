import { BadRequestException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CommunityClientListRequestDto } from "./dto/community-list.dto";
import { CommunityClientCreateRequestDto } from "./dto/community-create.dto";
import { CommunityClientUpdateRequestDto } from "./dto/community-update.dto";
import { CommunityDeleteRequestDto } from "./dto/community-delete.dto";
import { CommunityPost } from "./entity/community-posts.entity";
import { CommunityComment } from "./entity/community-comments.entity";
import { CommunityCommentCreateRequestDto } from "./dto/community-comment-create.dto";
import { CommunityCommentDeleteRequestDto } from "./dto/community-comment-delete.dto";
import { CommunityRepository } from "./community.repository";
import { handleSend, log } from "../config/log.tools.config";
import * as cheerio from 'cheerio';
import { MIME_TO_EXT } from "../common/enum/common.enum";
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { getMimeType } from "../common/functions/file-save.util";

@Injectable()
export class CommunityService {

    constructor(
        private readonly communityRepository: CommunityRepository,
    ) {}

    private async saveBase64DataUrlImage(
        dataUrl: string,
        outputDir: string,
        opts?: { maxBytes?: number },
    ) {

        const maxBytes = 10 * 1024 * 1024; // 기본 10MB 제한

        const m = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
        if (!m) {
            return null
        }

        const mime = m[1];
        const base64 = m[2];

        const ext = MIME_TO_EXT[mime];
        if (!ext) {
            return null
        }

        const buf = Buffer.from(base64, 'base64');
        if (buf.length === 0) return null;
        if (buf.length > maxBytes) return null;
        
        await fs.mkdir(outputDir, { recursive: true });

        const filename = `${randomUUID()}.${ext}`;
        const filepath = path.join(outputDir, filename);

        await fs.writeFile(filepath, buf);
        return filepath
        
    }

    private async extractAndSaveFirstBase64Image(html: string, token:any): Promise<string | null> {

        const $ = cheerio.load(html, { decodeEntities: false });
        const firstImg = $('img').first();

        if (!firstImg.length) {
            return null
        }

        const src = (firstImg.attr('src') ?? '').trim();
        if (!src.startsWith('data:image/')) {
        // 첫 번째 img가 base64가 아니면 아무것도 안 함
            return null;
        }

        let savePath = `${process.env.FILE_REPOSITORY_ROOT}/community/${token.id}/${token.type}/`
        const filePath = await this.saveBase64DataUrlImage(src, savePath);
        return filePath
    }



    async getList(dto: CommunityClientListRequestDto, token:any) {
        try {
            const items = await this.communityRepository.findByFilterList(dto.category, dto.filter, dto.q)
            const banners = await this.communityRepository.findByBanner(token.type)
        
            return handleSend({items, banners})
        } catch (error) {
            log('[CommunityService] getList',  '커뮤니티 목록 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('커뮤니티 목록 오류가 발생했습니다.')
        }
    }

    async getDetail(communityId: number, token:any) {
        try {
            
            const info = await this.communityRepository.findById(communityId);
            if (!info) {
                throw new NotFoundException('게시물을 찾을수 없습니다.')
            }

            if (info.type != token.type) {
                throw new BadRequestException('잘못된 요청입니다.')
            } 

            await this.communityRepository.updateViewCount(communityId)
            info.viewCount += 1
            return handleSend(info)

        } catch (error) {
            log('[CommunityService] getDetail',  '커뮤니티 상세 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('커뮤니티 상세 오류가 발생했습니다.')
        }
    }

    async createPost(dto: CommunityClientCreateRequestDto, token:any) {
        try {

            const communityPost = new CommunityPost()
            communityPost.type = token.type
            communityPost.title = dto.title
            communityPost.content = dto.content
            communityPost.authorId = token.id
            communityPost.category = dto.category

            const mainImage = await this.extractAndSaveFirstBase64Image(dto.content, token)
            console.log('mainImage', mainImage)
            if (mainImage) {
                communityPost.mainImage = mainImage
            }

            await this.communityRepository.saveCommunityPost(communityPost)
            return handleSend()
            
        } catch (error) {
            log('[CommunityService] getList',  '커뮤니티 등록 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('커뮤니티 등록 오류가 발생했습니다.')
        }
    }

    async updatePost(dto: CommunityClientUpdateRequestDto, token:any) {
        try {


            const postInfo = await this.communityRepository.findByIdPost(dto.postId)
            if (!postInfo) {
                throw new NotFoundException('게시물을 찾을수 없습니다.')
            }

            if (postInfo.type != token.type) {
                throw new BadRequestException('잘못된 요청입니다.')
            } 

            if (postInfo.authorId != token.id) {
                throw new ForbiddenException('수정 권한이 없습니다ㅏ.')
            }   

            postInfo.title = dto.title
            postInfo.content = dto.content         
            postInfo.category = dto.category

            const mainImage = await this.extractAndSaveFirstBase64Image(dto.content, token)
            if (postInfo.mainImage !== mainImage) {

                if (postInfo.mainImage) {
                    await fs.unlink(postInfo.mainImage)
                }

                postInfo.mainImage = mainImage
            }
            
            await this.communityRepository.saveCommunityPost(postInfo)

            return handleSend()
            
        } catch (error) {
            log('[CommunityService] updatePost',  '커뮤니티 수정 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('커뮤니티 수정 오류가 발생했습니다.')
        }
    }

    async deletePost(dto: CommunityDeleteRequestDto, token:any) {
        try {
            const postInfo = await this.communityRepository.findByIdPost(dto.postId)
            if (!postInfo) {
                throw new NotFoundException('게시물을 찾을수 없습니다.')
            }

            if (postInfo.category != token.type) {
                throw new BadRequestException('잘못된 요청입니다.')
            } 

            if (postInfo.authorId != token.id) {
                throw new ForbiddenException('수정 권한이 없습니다ㅏ.')
            }   

            postInfo.isDeleted = true
            await this.communityRepository.saveCommunityPost(postInfo)

            return handleSend()
            
        } catch (error) {
            log('[CommunityService] deletePost',  '커뮤니티 삭제 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('커뮤니티 삭제 오류가 발생했습니다.')
        }
    }

    async createPostComment(dto: CommunityCommentCreateRequestDto, token:any) {
        try {
            
            
            const info = await this.communityRepository.findById(dto.postId);
            if (!info) {
                throw new NotFoundException('게시물을 찾을수 없습니다.')
            }
            
            if (info.type != token.type) {
                throw new ForbiddenException('등록 권한이 업습니다.')
            } 

            const comment = new CommunityComment()
            comment.postId = dto.postId
            comment.authorId = token.id
            comment.content = dto.content
            comment.parentId = dto.parentId

            await this.communityRepository.saveCommunityComment(comment)
            const postInfo = await this.communityRepository.findById(dto.postId);

            return handleSend(postInfo)
            
        } catch (error) {
            log('[CommunityService] createPostComment',  '커뮤니티 댓글 등록 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('커뮤니티 댓글 등록 오류가 발생했습니다.')
        }
    }

    async deltePostComment(dto: CommunityCommentDeleteRequestDto, token:any) {
        try {
           
            const comment = await this.communityRepository.findByIdComment(dto.commentId);
            if (!comment) {
                throw new NotFoundException('댓글을 찾을수 없습니다.')
            }

            if (comment.authorId != token.id) {
                throw new ForbiddenException('삭제권한이 없습니다. ')
            } 

            
            comment.isDeleted = true
            const postId = comment.postId
            await this.communityRepository.saveCommunityComment(comment)
            const postInfo = await this.communityRepository.findById(postId);

            return handleSend(postInfo)
            
        } catch (error) {
            log('[CommunityService] createPostComment',  '커뮤니티 댓글 삭제 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('커뮤니티 댓글 등록 중 삭제 발생했습니다.')
        }

    }

    async getMainImage(id:number, res: Response) {
        try {
            
            const info = await this.communityRepository.findByIdPost(id)
            if (!info) {
                throw new NotFoundException()
            }

            if (!info.mainImage) {
                throw new NotFoundException()
            }

            const buf = await fs.readFile(info.mainImage)
            const mime = getMimeType(info.mainImage);

            res.setHeader('Content-Type', mime);
            return res.send(buf);
            
        } catch (error) {
            log('[CommunityService] createPostComment',  '커뮤니티 이미지 호출 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('커뮤니티 이미지 호출 중 삭제 발생했습니다.')
        }
    }
}