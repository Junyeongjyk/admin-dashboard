"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityService = void 0;
const common_1 = require("@nestjs/common");
const community_posts_entity_1 = require("./entity/community-posts.entity");
const community_comments_entity_1 = require("./entity/community-comments.entity");
const community_repository_1 = require("./community.repository");
const log_tools_config_1 = require("../../config/log.tools.config");
const cheerio = __importStar(require("cheerio"));
const common_enum_1 = require("../../common/enum/common.enum");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const crypto_1 = require("crypto");
const file_save_util_1 = require("../../common/functions/file-save.util");
let CommunityService = class CommunityService {
    communityRepository;
    constructor(communityRepository) {
        this.communityRepository = communityRepository;
    }
    async saveBase64DataUrlImage(dataUrl, outputDir, opts) {
        const maxBytes = 10 * 1024 * 1024; // 기본 10MB 제한
        const m = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
        if (!m) {
            return null;
        }
        const mime = m[1];
        const base64 = m[2];
        const ext = common_enum_1.MIME_TO_EXT[mime];
        if (!ext) {
            return null;
        }
        const buf = Buffer.from(base64, 'base64');
        if (buf.length === 0)
            return null;
        if (buf.length > maxBytes)
            return null;
        await fs.mkdir(outputDir, { recursive: true });
        const filename = `${(0, crypto_1.randomUUID)()}.${ext}`;
        const filepath = path.join(outputDir, filename);
        await fs.writeFile(filepath, buf);
        return filepath;
    }
    async extractAndSaveFirstBase64Image(html) {
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
    async getList(dto) {
        try {
            const result = await this.communityRepository.getList(dto);
            return (0, log_tools_config_1.handleSend)(result);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[CommunityService] getList', '커뮤니티 목록 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('커뮤니티 목록 오류가 발생했습니다.');
        }
    }
    async getDetail(communityId) {
        try {
            console.log('communityId', communityId);
            const info = await this.communityRepository.findById(communityId);
            console.log('info', info);
            if (!info) {
                throw new common_1.NotFoundException('게시물을 찾을수 없습니다.');
            }
            await this.communityRepository.updateViewCount(communityId);
            info.viewCount += 1;
            return (0, log_tools_config_1.handleSend)(info);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[CommunityService] getDetail', '커뮤니티 상세 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('커뮤니티 상세 오류가 발생했습니다.');
        }
    }
    async createPost(dto) {
        try {
            const communityPost = new community_posts_entity_1.CommunityPost();
            communityPost.title = dto.title;
            communityPost.content = dto.content;
            communityPost.category = dto.category;
            const mainImage = await this.extractAndSaveFirstBase64Image(dto.content);
            console.log('mainImage', mainImage);
            if (mainImage) {
                communityPost.mainImage = mainImage;
            }
            await this.communityRepository.saveCommunityPost(communityPost);
            return (0, log_tools_config_1.handleSend)();
        }
        catch (error) {
            (0, log_tools_config_1.log)('[CommunityService] getList', '커뮤니티 등록 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('커뮤니티 등록 오류가 발생했습니다.');
        }
    }
    async updatePost(dto) {
        try {
            const post = await this.communityRepository.findByIdPost(dto.postId);
            if (!post) {
                throw new common_1.NotFoundException('게시물을 찾을 수 없습니다.');
            }
            if (dto.title !== undefined)
                post.title = dto.title;
            if (dto.content !== undefined)
                post.content = dto.content;
            if (dto.category !== undefined)
                post.category = dto.category;
            await this.communityRepository.saveCommunityPost(post);
            return (0, log_tools_config_1.handleSend)(post);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[CommunityService] updatePost', '커뮤니티 수정 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('커뮤니티 수정 오류가 발생했습니다.');
        }
    }
    async deletePost(dto) {
        try {
            const postInfo = await this.communityRepository.findByIdPost(dto.postId);
            if (!postInfo) {
                throw new common_1.NotFoundException('게시물을 찾을수 없습니다.');
            }
            postInfo.isDeleted = true;
            await this.communityRepository.saveCommunityPost(postInfo);
            return (0, log_tools_config_1.handleSend)();
        }
        catch (error) {
            (0, log_tools_config_1.log)('[CommunityService] deletePost', '커뮤니티 삭제 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('커뮤니티 삭제 오류가 발생했습니다.');
        }
    }
    async createPostComment(dto) {
        try {
            const info = await this.communityRepository.findById(dto.postId);
            if (!info) {
                throw new common_1.NotFoundException('게시물을 찾을수 없습니다.');
            }
            const comment = new community_comments_entity_1.CommunityComment();
            comment.postId = dto.postId;
            comment.content = dto.content;
            comment.parentId = dto.parentId;
            await this.communityRepository.saveCommunityComment(comment);
            const postInfo = await this.communityRepository.findById(dto.postId);
            return (0, log_tools_config_1.handleSend)(postInfo);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[CommunityService] createPostComment', '커뮤니티 댓글 등록 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('커뮤니티 댓글 등록 오류가 발생했습니다.');
        }
    }
    async deltePostComment(dto) {
        try {
            const comment = await this.communityRepository.findByIdComment(dto.commentId);
            if (!comment) {
                throw new common_1.NotFoundException('댓글을 찾을수 없습니다.');
            }
            comment.isDeleted = true;
            const postId = comment.postId;
            await this.communityRepository.saveCommunityComment(comment);
            const postInfo = await this.communityRepository.findById(postId);
            return (0, log_tools_config_1.handleSend)(postInfo);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[CommunityService] createPostComment', '커뮤니티 댓글 삭제 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('커뮤니티 댓글 등록 중 삭제 발생했습니다.');
        }
    }
    async getMainImage(id, res) {
        try {
            const info = await this.communityRepository.findByIdPost(id);
            if (!info) {
                throw new common_1.NotFoundException();
            }
            if (!info.mainImage) {
                throw new common_1.NotFoundException();
            }
            const buf = await fs.readFile(info.mainImage);
            const mime = (0, file_save_util_1.getMimeType)(info.mainImage);
            res.setHeader('Content-Type', mime);
            return res.send(buf);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[CommunityService] createPostComment', '커뮤니티 이미지 호출 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('커뮤니티 이미지 호출 중 삭제 발생했습니다.');
        }
    }
};
exports.CommunityService = CommunityService;
exports.CommunityService = CommunityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [community_repository_1.CommunityRepository])
], CommunityService);
//# sourceMappingURL=community.service.js.map