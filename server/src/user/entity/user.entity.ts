import { Column, CreateDateColumn, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AuthType, Gender, SignupType, UserType } from "../../common/enum/user.enum";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn({comment: 'id'})
    id?: number;

    /* ===== 기본 정보 ===== */
    @Column({ type: 'varchar', length: 50, comment: '아이디(이메일)' })
    identity?: string;

    @Column({ type: 'varchar', length: 255, comment: '패스워드'})
    password?: string;

    @Column({ type: 'varchar', length: 50, comment: '이름' })
    name?: string;

    @Column({ type: 'varchar', length: 20, comment: '연착처' })
    phone?: string;

    @Column({ type: 'varchar', length: 100, nullable: true, comment: '이메일' })
    email?: string | null;

    /* ===== 개인정보 ===== */
    @Column({ type: 'date', nullable: true, comment: '생년월일' })
    birthday?: string | null;

    @Column({
        type: 'enum',
        enum: Gender,
        comment: '성별'
    })
    gender?: Gender | null;

    @Column({
        name: 'user_type',
        type: 'enum',
        enum: UserType,
        comment: '회원 유형'
    })
    userType?: UserType;

    @Column({
        name: 'auth_type',
        type: 'enum',
        enum: AuthType,
        comment: '로그인 인증정보',
        nullable: true
    })
    authType?: AuthType;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive?: boolean;

    @Column({ name: 'is_email_verified', type: 'boolean', default: false })
    isEmailVerified?: boolean;

    /* ===== 로그인 ===== */

    @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
    lastLoginAt?: Date | null;

    /* ===== 주소 ===== */

    @Column({ type: 'varchar', nullable: true })
    address?: string | null;

    @Column({ name:'detail_address', type: 'varchar', nullable: true })
    detailAddress?: string | null;

    @Column({ type: 'varchar', nullable: true })
    zipcode?: string | null;

    /* ===== 타임스탬프 ===== */

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt?: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt?: Date;

    @Column({ name: 'marketing_agreed', type: 'boolean', default: false})
    marketingAgreed?: boolean;

    @Column({
        name: 'uuid',
        type: 'varchar',
        nullable: true,
        comment: '모바일 앱 디바이스 UUID',
    })
    uuid?: string | null

    @Column({
        name: 'is_two_factor_enabled',
        type: 'boolean',
        default: false,
        comment: '2차 인증 사용 여부',
    })
    isTwoFactorEnabled?: boolean;

    @Column({
        name: 'is_notification_agreed',
        type: 'boolean',
        default: false,
        comment: '알림 수신 동의 여부',
    })
    isNotificationAgreed?: boolean;

    @Column({
        name: 'is_deleted',
        type: 'boolean',
        default: false,
        comment: '회원 탈퇴 여부',
    })
    isDeleted?: boolean;

    @Column({
        name: 'deleted_at',
        type: 'timestamptz',
        nullable: true,
        comment: '회원 탈퇴 일시',
    })
    deletedAt?: Date | null;
}