import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity('system_option')
export class SystemOption {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 0.0,
  })
  commission?: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt?: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  bank?: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'account_number',
  })
  accountNumber?: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'account_name',
  })
  accountName?: string | null;

  @Column({
    name: 'use_ip_access_control',
    type: 'boolean',
    default: false,
  })
  useIpAccessControl?: boolean;
}