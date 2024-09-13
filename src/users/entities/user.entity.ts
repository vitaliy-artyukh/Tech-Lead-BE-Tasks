import 'reflect-metadata'
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string

    @Column('varchar')
    public name: string

    @Column('varchar')
    public surname: string

    @Index({ unique: true })
    @Column('varchar')
    public email: string

    @Index({ unique: true })
    @Column({ type: 'varchar', name: 'phone_number' })
    public phoneNumber: string

    @Column('varchar')
    public password: string

    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date
}
