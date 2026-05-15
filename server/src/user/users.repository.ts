import { Injectable } from "@nestjs/common";
import { Users } from "./entity/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserSocialAccounts } from "./entity/user-social-accounts.entity";
import { UserAuthHistories } from "./entity/user-auth-histories.entity";
import { UsersInfoResponseDto } from "./dto/data/users-info-data.dto";
import { UserType } from "../common/enum/users.enum";

@Injectable()
export class UsersRepository {

    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        @InjectRepository(UserSocialAccounts)
        private readonly usersSocialAccountRepository: Repository<UserSocialAccounts>,
        @InjectRepository(UserAuthHistories)
        private readonly userAuthHistoriesRepository: Repository<UserAuthHistories>
        
    ) {}

    async saveUsers(user: Users): Promise<Users> {
        return await this.usersRepository.save(user);
    }

    async saveUserAuthHistories(userAuthHistories: UserAuthHistories): Promise<UserAuthHistories> {
        return await this.userAuthHistoriesRepository.save(userAuthHistories)
    }

    async saveUserSocialAccounts(userSocialAccounts: UserSocialAccounts): Promise<UserSocialAccounts> {
        return await this.usersSocialAccountRepository.save(userSocialAccounts);
    }


    async isIdentityAvailable(identity: string): Promise<boolean> {
        const count = await this.usersRepository.createQueryBuilder('user')
                                .where('LOWER(user.identity) = LOWER(:identity)', { identity })
                                .getCount();
        return count <= 0;
    }

    async isSnsAvailable(providerUserId: string): Promise<boolean> {
        const count = await this.usersSocialAccountRepository.createQueryBuilder('social')
                                .where('LOWER(social.providerUserId) = LOWER(:providerUserId)', { providerUserId })
                                .getCount();
        return count <= 0;
    }



    async findByIdentity(identity: string): Promise<Users | null> {
        return await this.usersRepository.createQueryBuilder('user')
                        .where('LOWER(user.identity) = LOWER(:identity)', { identity })
                        .getOne()
    }

    async findByProviderUserId(providerUserId: string): Promise<UserSocialAccounts | null> {
        return  await this.usersSocialAccountRepository.createQueryBuilder('social')
                    .leftJoinAndSelect('social.user', 'user')
                    .where('social.providerUserId  = :providerUserId ', {providerUserId})
                    .getOne()
    }

    async findById(id:number): Promise<UsersInfoResponseDto | undefined> {
        return await this.usersRepository.createQueryBuilder('u')
            .leftJoin('u.partnerProfile', 'd')
            .select([
                'u.id AS id',
                'u.identity AS identity',
                'u.name AS name',
                'u.email AS email',
                'u.address AS address',
                'u.zipcode AS zipcode',
                'u.detail_address AS "detailAddress"',
                'u.is_two_factor_enabled AS "isTwoFactorEnabled"',
                'd.nickname AS nickname',
                'u.is_notification_agreed AS "isNotificationAgreed"',
                'u.user_type AS "userType"',
                'u.email AS email',
                'u.phone as phone',
                'u.is_email_verified as "isEmailVerified"',
                'u.gender AS gender' 
            ])
            .where('u.id = :id', { id })
            .getRawOne(); 
    }


    async findByIdInfo(id:number): Promise<Users | null> {
        return await this.usersRepository.createQueryBuilder('u')
                        .where('u.id = :id', {id})
                        .getOne();
    }

    async findByNamePhone(name:string, phone: string) : Promise<Users | null> {
        return await this.usersRepository.createQueryBuilder('user')
                        .where('user.user_type <> :userType', { userType: UserType.ADMIN })
                        .andWhere('user.name = :name', { name })
                        .andWhere('user.phone = :phone', { phone })
                        .andWhere('user.is_deleted = :isDeleted', { isDeleted: false })
                        .getOne();
    }
    

    async findByIdentityPhone(identity:string, phone: string) : Promise<Users | null> {
        return await this.usersRepository.createQueryBuilder('user')
                        .where('user.user_type <> :userType', { userType: UserType.ADMIN })
                        .andWhere('user.identity = :identity', { identity })
                        .andWhere('user.phone = :phone', { phone })
                        .andWhere('user.is_deleted = :isDeleted', { isDeleted: false })
                        .getOne();
    }
}

