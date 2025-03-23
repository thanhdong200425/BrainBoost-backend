import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Deck} from "./Deck";

@Entity('Flashcard')
export class Flashcard {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({name: "front_text", type: 'text'})
    frontText!: string

    @Column({name: "back_text", type: 'text'})
    backText!: string

    @Column({name: 'image_url', type: 'text', nullable: true})
    imageUrl?: string

    @Column({name: "audio_url", type: 'text', nullable: true})
    audioUrl?: string

    @Column({type: "text", nullable: true})
    description?: string

    @CreateDateColumn({name: 'created_at'})
    createdAt!: Date

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt!: Date

    // @ts-ignore
    @ManyToOne(() => Deck, (deck: Deck) => Deck.id, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    @JoinColumn({name: "deckId"})
    deck!: Deck
}