import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "../../user/entity/users.entity";
import { RequestCategory } from "../../common/enum/category.enum";
import { DetectiveCertification } from "./detective-certifications.entity";
import { DetectiveMatch } from "./detective-match.entity";
import { InvestigationReport } from "../../requests/entity/investigation-report.entity";
import { ExpenseClaim } from "../../requests/entity/expense-claims.entity";
import { RequestCompletion } from "../../requests/entity/request-completions.entity";

@Entity({ name: 'detective_profiles' })
export class DetectiveProfiles {

    @PrimaryGeneratedColumn()
    id: number;
    
    /**
     * users.id (1:1)
     */
    @Column({ type: 'bigint', name: 'user_id' })
    userId: number;

    @OneToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @Column({ type: 'varchar', length: 50 })
    nickname: string;

    @CreateDateColumn({
        type: 'timestamptz',
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @Column({
        name: 'profile_path',
        type: 'varchar',
        nullable: true,
    })
    profilePath: string | null;


    @OneToMany(() => DetectiveCertification, (cert) => cert.detective)
    certifications: DetectiveCertification[];

    @OneToMany(() => DetectiveMatch, (match) => match.detective)
    matches: DetectiveMatch[];

    @OneToMany(() => InvestigationReport, (report) => report.request)
    investigationReports: InvestigationReport[];

    @OneToMany(() => ExpenseClaim, (expenseClaim) => expenseClaim.detective)
    expenseClaims: ExpenseClaim[];

    @OneToOne(() => RequestCompletion, (requestCompletion) => requestCompletion.detective)
    requestCompletions: RequestCompletion;
}