import { BadRequestException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CommunityListRequestDto } from "./dto/community-list.dto";
import { CommunityCreateRequestDto } from "./dto/community-create.dto";
import { CommunityUpdateRequestDto } from "./dto/community-update.dto";
import { CommunityDeleteRequestDto } from "./dto/community-delete.dto";
import { CommunityPost } from "./entity/community-posts.entity";
import { CommunityComment } from "./entity/community-comments.entity";
import { CommunityCommentCreateRequestDto } from "./dto/community-comment-create.dto";
import { CommunityCommentDeleteRequestDto } from "./dto/community-comment-delete.dto";
import { CommunityRepository } from "./community.repository";
import { handleSend, log } from "../../config/log.tools.config";
import * as cheerio from 'cheerio';
import { MIME_TO_EXT } from "../../common/enum/common.enum";
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { getMimeType } from "../../common/functions/file-save.util";

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

    private async extractAndSaveFirstBase64Image(html: string): Promise<string | null> {

        const $ = cheerio.load(html, { decodeEntities: false });
        const firstImg = $('img').first();

        if (!firstImg.length) {
            return null;
        }

        const src = (firstImg.attr('src') ?? '').trim();
        if (!src.startsWith('data:image/')) {
            return null;
        }

        const savePath = `${process.env.FILE_REPOSITORY_ROOT}/community/admin/`;

        const filePath = await this.saveBase64DataUrlImage(src, savePath);
        return filePath;
    }


    async getList(dto: CommunityListRequestDto) {
        try {
            const result = await this.communityRepository.getList(dto)
            return handleSend(result)
        } catch (error) {
            log('[CommunityService] getList',  '커뮤니티 목록 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('커뮤니티 목록 오류가 발생했습니다.')
        }
    }
    
    async getDetail(communityId: number) {
        try {
            console.log('communityId', communityId)

            const info = await this.communityRepository.findById(communityId);
            console.log('info', info)
            if (!info) {
                throw new NotFoundException('게시물을 찾을수 없습니다.')
            }

            await this.communityRepository.updateViewCount(communityId);
            info.viewCount += 1;

            return handleSend(info);
        } catch (error) {
            log('[CommunityService] getDetail',  '커뮤니티 상세 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('커뮤니티 상세 오류가 발생했습니다.')
        }
    }

    async createPost(dto: CommunityCreateRequestDto ) {
        try {

            const communityPost = new CommunityPost()
                communityPost.title = dto.title
                communityPost.content = dto.content
                communityPost.category = dto.category
            
                const mainImage = await this.extractAndSaveFirstBase64Image(dto.content)
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

    async updatePost(dto: CommunityUpdateRequestDto) {
        try {

            const post = await this.communityRepository.findByIdPost(dto.postId);
            if (!post) {
                throw new NotFoundException('게시물을 찾을 수 없습니다.');
            }

            if (dto.title !== undefined) post.title = dto.title;
            if (dto.content !== undefined) post.content = dto.content;
            if (dto.category !== undefined) post.category = dto.category;

            await this.communityRepository.saveCommunityPost(post);

            return handleSend(post);
            
        } catch (error) {
            log('[CommunityService] updatePost',  '커뮤니티 수정 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('커뮤니티 수정 오류가 발생했습니다.')
        }
    }

    async deletePost(dto: CommunityDeleteRequestDto) {
        try {
            const postInfo = await this.communityRepository.findByIdPost(dto.postId);

            if (!postInfo) {
                throw new NotFoundException('게시물을 찾을수 없습니다.');
            }

            postInfo.isDeleted = true;

            await this.communityRepository.saveCommunityPost(postInfo);

            return handleSend();
            
        } catch (error) {
            log('[CommunityService] deletePost',  '커뮤니티 삭제 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('커뮤니티 삭제 오류가 발생했습니다.')
        }
    }

    async createPostComment(dto: CommunityCommentCreateRequestDto) {
        try {
            
            const info = await this.communityRepository.findById(dto.postId);
            if (!info) {
                throw new NotFoundException('게시물을 찾을수 없습니다.')
            }
    
            const comment = new CommunityComment()
            comment.postId = dto.postId
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
    
    async deltePostComment(dto: CommunityCommentDeleteRequestDto) {
        try {
           
            const comment = await this.communityRepository.findByIdComment(dto.commentId);
            if (!comment) {
                throw new NotFoundException('댓글을 찾을수 없습니다.')
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