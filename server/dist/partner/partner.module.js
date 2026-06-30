"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const partner_repository_1 = require("./partner.repository");
const partner_controller_1 = require("./partner.controller");
const partner_service_1 = require("./partner.service");
const jwt_1 = require("@nestjs/jwt");
const partner_certifications_entity_1 = require("./entity/partner-certifications.entity");
const partner_profiles_entity_1 = require("./entity/partner-profiles.entity");
const partner_match_entity_1 = require("./entity/partner-match.entity");
const partner_location_logs_entity_1 = require("./entity/partner-location-logs.entity");
const mqtt_module_1 = require("../mqtt/mqtt.module");
let PartnerModule = class PartnerModule {
};
exports.PartnerModule = PartnerModule;
exports.PartnerModule = PartnerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mqtt_module_1.MqttModule,
            typeorm_1.TypeOrmModule.forFeature([
                partner_profiles_entity_1.PartnerProfiles, partner_certifications_entity_1.PartnerCertification, partner_match_entity_1.PartnerMatch,
                partner_location_logs_entity_1.PartnerLocationLog
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET_KEY,
                signOptions: {
                    expiresIn: parseInt(process.env.JWT_EXPIRES ?? '86400')
                }
            }),
        ],
        controllers: [partner_controller_1.PartnerController],
        providers: [partner_repository_1.PartnerRepository, partner_service_1.PartnerService],
        exports: [partner_repository_1.PartnerRepository, partner_service_1.PartnerService]
    })
], PartnerModule);
//# sourceMappingURL=partner.module.js.map