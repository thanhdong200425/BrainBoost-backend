import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./User";

@Entity('folders')
export class Folder {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({type: "varchar"})
    name!: string

    @Column({type: "enum", default: "private"})
    visibility!: string

    @CreateDateColumn({name: "createdAt"})
    createdAt!: Date

    @UpdateDateColumn({name: "updatedAt"})
    updatedAt!: Date

    @ManyToOne(() => User, (user: User) => user.id, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    @JoinColumn({name: "authorId"})
    author!: User
}