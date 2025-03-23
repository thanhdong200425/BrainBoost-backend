import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,} from "typeorm";
import {Class} from "./Class";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({type: 'varchar', unique: true})
    email!: string

    @Column({type: "text"})
    password!: string

    @Column({type: "varchar", unique: true, nullable: true})
    username?: string

    @Column({type: "date", nullable: true})
    dob?: Date

    @Column({type: "text", nullable: true})
    avatar_url?: string

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @OneToMany(() => Class, (classEntity: Class) => classEntity.author)
    classes?: Class[]
}