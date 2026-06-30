"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityModule = void 0;
const common_1 = require("@nestjs/common");
const community_controller_1 = require("./community.controller");
const community_service_1 = require("./community.service");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../../user/entity/users.entity");
const community_posts_entity_1 = require("../../community/entity/community-posts.entity");
const community_comments_entity_1 = require("../../community/entity/community-comments.entity");
const community_repository_1 = require("./community.repository");
const jwt_1 = require("@nestjs/jwt");
let CommunityModule = class CommunityModule {
};
exports.CommunityModule = CommunityModule;
exports.CommunityModule = CommunityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                users_entity_1.User,
                community_comments_entity_1.CommunityComment,
                community_posts_entity_1.CommunityPost
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET_KEY,
                signOptions: {
                    expiresIn: parseInt(process.env.JWT_EXPIRES ?? '86400')
                }
            }),
        ],
        controllers: [community_controller_1.CommunityController],
        providers: [community_service_1.CommunityService, community_repository_1.CommunityRepository],
        exports: [community_service_1.CommunityService, community_repository_1.CommunityRepository]
    })
], CommunityModule);
//# sourceMappingURL=community.module.js.map