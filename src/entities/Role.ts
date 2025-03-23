import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('increment')
    id!: number

    @Column({type: "varchar"})
    name!: string

    @CreateDateColumn({name: "createdAt"})
    createdAt!: Date

    @UpdateDateColumn({name: "updatedAt"})
    updatedAt!: Date
}