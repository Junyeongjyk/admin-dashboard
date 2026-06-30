"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const database_config_1 = require("./config/database.config");
const global_module_1 = require("./global/global.module");
const auth_module_1 = require("./auth/auth.module");
const redis_module_1 = require("./redis/redis.module");
const authentication_middleware_1 = require("./middleware/authentication.middleware");
let AppModule = class AppModule {
    authenticationMiddleware;
    constructor(authenticationMiddleware) {
        this.authenticationMiddleware = authenticationMiddleware;
    }
    configure(consumer) {
        consumer.apply(this.authenticationMiddleware.use.bind(this.authenticationMiddleware)).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            redis_module_1.RedisModule,
            global_module_1.GlobalModule,
            auth_module_1.AuthModule,
            typeorm_1.TypeOrmModule.forRoot(database_config_1.databaseConfig.options)
        ],
        controllers: [],
        providers: [
            authentication_middleware_1.AuthenticationMiddleware
        ],
    }),
    __metadata("design:paramtypes", [authentication_middleware_1.AuthenticationMiddleware])
], AppModule);
//# sourceMappingURL=app.module.js.map