import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { handleSend, log } from "../config/log.tools.config";
import { RedisKeys, RedisTTL } from "../redis/redis-keys";
import { REDIS } from "../redis/redis.module";
import Redis from "ioredis";
import { generate6DigitCode, getHex512, maskEmail, nowKstIso } from "../common/functions/common";
import { SigninRequestDto } from "./dto/auth-signup.dto";
import { UserRepository } from "../user/user.repository";
import { LoginAction, SignupPath, UserType } from "../common/enum/user.enum";
import { createKey, encrypt } from "../common/functions/aes.util";
import { SigninResponseDto } from "./dto/data/auth-signin-data.dto";
import { RecoverIdentityResponseDto } from "./dto/data/auth-recover-identity-data.dto";
import { recoverIdentityRequestDto } from "./dto/auth-recover-identity.dto";
import { CheckIdentityRequestDto } from "./dto/auth-check-identity.dto";
import { ResetPasswordComfirmRequestDto } from "./dto/auth-reset-password-comfirm.dto";
import { User } from "../user/entity/user.entity";
import { PartnerRepository } from "../partner/partner.repository";
import { UserAuthHistories } from "../user/entity/user-auth-histories.entity";
import { Request, Response } from 'express';
import { JwtService } from "@nestjs/jwt";
import { Sign } from "../common/sign.helper";
import { SignoutRequestDto } from "./dto/auth-signout.dto";
import { SessionStore } from "../common/store/session.store";
import { ForceLogoutPayload } from "../mqtt/types/envelope.types";
import { buildEnvelope } from "../mqtt/function/envelope.builder";
import { MqttPublisherService } from "../mqtt/mqtt.service";
import { REALTIME_TOPIC } from "../mqtt/types/mqtt.constants";
import { EventType } from "../mqtt/types/event.types";
import { RealtimeCredentialService } from "../mqtt/realtime-credential.service";
import * as fs from 'fs/promises';
import { getMimeType } from "../common/functions/file-save.util";

type VerifyCache = {
    code: string;
    sentAt: string;   
};

@Injectable()
export class AuthService {

    private readonly CODE_TTL_SECONDS = 3 * 60;     // 인증번호 유효시간 5분
    private readonly RESEND_COOLDOWN_SECONDS = 30;  // 재전송 쿨다운 60초(옵션)

    constructor(
        @Inject(REDIS) private readonly redis: Redis,
        private readonly userRepository: UserRepository,
        private readonly partnerRepository: PartnerRepository,
        private jwtService: JwtService,
        private sign: Sign,
        private readonly sessions: SessionStore,
        private readonly mqttPublisherService: MqttPublisherService,
        private readonly realtimeCredentialService: RealtimeCredentialService
    ) {}


    async signin(dto: SigninRequestDto, res: Response, req: Request, ip:string) {
        try {
            
            const userAgent = req.get('user-agent');

            //유정 존재 여부 확인
            let userInfo: User | null = null;
            if (dto.provider == SignupPath.NORMAL) {
                userInfo = await this.userRepository.findByIdentity(dto.plainIdentity)
            } else if (dto.provider == SignupPath.ADMIN){
                userInfo = await this.userRepository.findByIdentity(dto.plainIdentity)
            } 

            const history = new UserAuthHistories()
            history.ipAddress = ip
            history.uuid = dto.uuid
            history.isSuccess = false
            history.userId = null
            history.action = LoginAction.LOGIN_FAIL
            history.userAgent = userAgent ?? ''

            if (!userInfo) {
                history.failReason = '아이디 불일치'

                await this.userRepository.saveUserAuthHistories(history)
                throw new UnauthorizedException('로그인 정보가 올바르지 않습니다.')
            } else {
                
                history.userId = userInfo.id

                if (dto.provider == SignupPath.NORMAL || dto.provider == SignupPath.ADMIN) {
                    if (getHex512(dto.plainPassword) != userInfo.password) {
                        history.failReason = '패스워드 불일치'

                        await this.userRepository.saveUserAuthHistories(history)
                        throw new UnauthorizedException('로그인 정보가 올바르지 않습니다.')
                    }
                }

                if (userInfo.userType == UserType.PARTNER) { //파트너인 경우 승인여부 체크
                    const partnerProfile = await this.partnerRepository.findByUserid(userInfo.id)
                    if (!partnerProfile) {
                        history.userId = userInfo.id
                        history.failReason = '파트너 프로필정보 미존재'

                        await this.userRepository.saveUserAuthHistories(history)
                        throw new NotFoundException('파트너 프로필 정보가 올바르지 않습니다.')
                    } else {
                        if (!partnerProfile.isVerified) {
                            history.userId = userInfo.id
                            history.failReason = '파트너 미승인'

                            await this.userRepository.saveUserAuthHistories(history)
                            throw new ForbiddenException('계정이 승인되지 않았습니다');
                        }
                    }
                }

                if (dto.provider == SignupPath.ADMIN &&  userInfo.userType != UserType.ADMIN)//관리자 로그인 체크
                {
                    history.userId = userInfo.id
                    history.failReason = '관리자 로그인 실패'

                    await this.userRepository.saveUserAuthHistories(history)
                    throw new ForbiddenException('관리자가 아닌 계정이 로그인하였습니다.');
                }

                if (!userInfo.isActive) {
                    history.userId = userInfo.id
                    history.failReason = '계정 비활성화'

                    await this.userRepository.saveUserAuthHistories(history)
                    throw new UnauthorizedException('비활성된 계정입니다.')
                }
            }

            const clientId = `${userInfo.userType}-${userInfo.id}-${dto.deviceId}`;

            //로그인 상태 저장
            userInfo.lastLoginAt = new Date()
            userInfo.uuid = dto.uuid?.trim() ? dto.uuid.trim() : null;
            await this.userRepository.saveUser(userInfo)
            // 로그인 내역 저장
            history.userId = userInfo.id
            history.isSuccess = true
            history.action = LoginAction.LOGIN
            await this.userRepository.saveUserAuthHistories(history)

            //access 토큰 저장
            const payload = {
                id: userInfo.id,
                name: userInfo.name,
                type: userInfo.userType,
                clientId: clientId
            }

            const accessToken = this.jwtService.sign(payload)
            await this.sign.in(res, accessToken)

            const key = createKey()
            
            //mqtt 자격 추가
            const mqttCred = await this.realtimeCredentialService.issueOnLogin({
                userId: `${userInfo.id}`,
                deviceId: dto.deviceId,
                clientId: clientId
            }) 

            const result : SigninResponseDto = {
                id: userInfo.id,
                name : encrypt(key, userInfo.name),
                userType: userInfo.userType,
                clientId: encrypt(key, clientId),
                username: encrypt(key, mqttCred.username),
                password: encrypt(key, mqttCred.password),
            }

            const oldUserId = this.sessions.getActiveUserId(`${userInfo.id}`)
            if (oldUserId && oldUserId !== clientId) { //
                const payload: ForceLogoutPayload = {
                    reason: '중복 로그인되어 로그아웃 되었습니다.',
                    kicked_by_session_id: clientId,
                };

                const envelope = buildEnvelope({
                    event_type: EventType.AUTH_FORCE_LOGOUT,
                    scope: { role: userInfo.userType, user_id: `${userInfo.id}` },
                    payload,
                });
   
                this.mqttPublisherService.publish(REALTIME_TOPIC, envelope)
            }
            this.sessions.setActiveUserId(`${userInfo.id}`, clientId)

            return handleSend(result)

        } catch (error) {
            log('[AuthService] signin',  '로그인 에러', error)
  
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('로그인 오류가 발생했습니다.')
        }
    }

    async checkIdentity(dto: CheckIdentityRequestDto) {
        try {
            
            const isAvailable  = await this.userRepository.isIdentityAvailable(dto.plainIdentity);
            if (!isAvailable ) {
                throw new ConflictException('이미 존재하는 아이디입니다.');
            }

            return handleSend()

        } catch (error) {
            log('[AuthService] checkIdentity',  '아이디 중복검사 에러', error)
  
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('아이디 중복 검사 오류가 발생했습니다.')
        }
    }

    async recoverIdentity(dto: recoverIdentityRequestDto) {
        try {
            
            const userInfo = await this.userRepository.findByNamePhone(dto.plainName, dto.plainPhoneNumber)    

            if (!userInfo) {
                throw new NotFoundException('아이디가 존재하지 않습니다.')
            }

            const result :RecoverIdentityResponseDto = {
                identity: maskEmail(userInfo.identity) 
            }

            return handleSend(result)

        } catch (error) {
            log('[AuthService] recoverIdentity',  '아이디 찾기 에러', error)
  
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('아이디 찾기 오류가 발생했습니다.')
        }
    }

    async resetPasswordRequeset(dto: CheckIdentityRequestDto) {
        try {

            const userInfo = await this.userRepository.findByIdentityPhone(dto.plainIdentity, dto.plainPhoneNumber)    
            if (!userInfo) {
                throw new NotFoundException('아이디가 존재하지 않습니다.')
            }

            return handleSend()
            
        } catch (error) {
            log('[AuthService] recoverIdentity',  '패스워드 찾기 중 오류가 발생했습니다.', error)
  
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('패스워드 찾기 오류가 발생했습니다.')
        }
    }   

    async resetPasswordComfirm(dto: ResetPasswordComfirmRequestDto) {
        try {

            const userInfo = await this.userRepository.findByIdentity(dto.plainIdentity)
            if (!userInfo) {
                throw new NotFoundException('아이디가 존재하지 않습니다.')
            }

            if (userInfo.isDeleted) {
                throw new BadRequestException('패스워드 초기화 할수 없는 아이디 입니다.')
            }

            userInfo.password = getHex512(dto.plainPassword)

            await this.userRepository.saveUser(userInfo)
            
            return handleSend()
            
        } catch (error) {
            log('[AuthService] recoverIdentity',  '패스워드 찾기 중 오류가 발생했습니다.', error)
  
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('패스워드 찾기 재설정 오류가 발생했습니다.')
        }
    }

    async logout(dto:SignoutRequestDto, token:any, req: Request, res: Response, ip:string) {
        try {

            const userAgent = req.get('user-agent');

            const history = new UserAuthHistories()
            history.ipAddress = ip
            history.uuid = dto.uuid
            history.isSuccess = true
            history.userId = token.id
            history.action = LoginAction.LOGOUT
            history.userAgent = userAgent ?? ''

            await this.userRepository.saveUserAuthHistories(history)

            //액세스토큰 삭제
            await this.sign.out(res);
            //mtqq  자격증명 해제
            await this.realtimeCredentialService.revokeOnLogout({
                userId: token.id,
                deviceId: dto.deviceId
            })
            return handleSend()
            
        } catch (error) {
            log('[AuthService] logout',  '로그아웃 중 오류가 발생했습니다.', error)
  
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('로그아웃 오류가 발생했습니다.')
        }
    }

    async getPartnerProfileImage(id:number, res: Response) {
        try {
            
            const profileInfo = await this.partnerRepository.findById(id)

            if (!profileInfo) {
                throw new NotFoundException()
            }

            const buf = await fs.readFile(profileInfo.profilePath!)
            const mime = getMimeType(profileInfo.profilePath!);

            res.setHeader('Content-Type', mime);
            return res.send(buf);
            
        } catch (error) {
            log('[AuthService] getPartnerProfileImage',  '파트너 프로필사진 호출중 에러가  발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('파트너 프로필사진 호출 중 삭제 발생했습니다.')
        }
    }
}

