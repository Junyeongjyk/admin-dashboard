import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../../user/users.entity"
import { Repository } from "typeorm";
import { UserType } from "../enum/users.enum";
import { PartnerProfiles } from "../../partner/entity/partner-profiles.entity

@Injectable()
export class TokenAuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        @InjectRepository(PartnerProfiles)
        private readonly partnerProfilesRepository: Repository<PartnerProfiles>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['access-token'];

        try {

            if (!token) new ForbiddenException('허용되지 않은 요청입니다.')

            const decoded = await this.jwtService.verifyAsync(token);
            const user = await this.usersRepository.createQueryBuilder('user')
                .where('user.id = :id', {id: decoded.id})
                .getOne();
            
            if (!user) {
                throw new ForbiddenException('허용되지 않은 요청입니다.');
            } else {
                if (!user.isActive) {
                    throw new ForbiddenException('허용되지 않은 요청입니다.');
                }

                if (user.userType == UserType.PARTNER) {
                    const profile = await this.partnerProfilesRepository.createQueryBuilder('profile')
                        .where('profile.userId = :userId', {userId: user.id})
                        .getOne()

                    if (!profile || !profile?.isVerified) {
                        throw new ForbiddenException('허용되지 않은 요청입니다.');
                    }
                }
            }
            
            return true
        } catch (error) {
            const response = context.switchToHttp().getResponse();
            await response.cookie('access-token', null, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                path: '/',
                maxAge: 0,
            });
            throw new ForbiddenException('허용되지 않은 요청입니다.');
        }
        
        
    }

    
}

export class TokenAdminAuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['access-token'];

    if (!token) {
      throw new ForbiddenException();
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token);

      const admin = await this.usersRepository.findOne({
        where: { id: decoded.id }
      });

      if (!admin) {
        throw new ForbiddenException();
      }

      request.admin = admin;
      return true;

    } catch {
      throw new ForbiddenException();
    }
  }
}