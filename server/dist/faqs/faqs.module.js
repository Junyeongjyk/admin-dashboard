"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqsModule = void 0;
const common_1 = require("@nestjs/common");
const faqs_service_1 = require("./faqs.service");
const faqs_controller_1 = require("./faqs.controller");
const faqs_repository_1 = require("./faqs.repository");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../user/entity/users.entity");
const jwt_1 = require("@nestjs/jwt");
const faqs_entity_1 = require("./entity/faqs.entity");
let FaqsModule = class FaqsModule {
};
exports.FaqsModule = FaqsModule;
exports.FaqsModule = FaqsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                users_entity_1.User, faqs_entity_1.Faqs
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET_KEY,
                signOptions: {
                    expiresIn: parseInt(process.env.JWT_EXPIRES ?? '86400')
                }
            }),
        ],
        controllers: [faqs_controller_1.FaqsController],
        providers: [faqs_service_1.FaqsService, faqs_repository_1.FaqsRepository],
        exports: [faqs_service_1.FaqsService, faqs_repository_1.FaqsRepository]
    })
], FaqsModule);
//# sourceMappingURL=faqs.module.js.map