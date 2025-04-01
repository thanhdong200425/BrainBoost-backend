import { Repository } from "typeorm";
import { Deck } from "../entities";
import { BaseRepository } from "./BaseRepository";

export class DeckRepository extends BaseRepository<Deck> {
    private deckRepo: Repository<Deck>;

    constructor() {
        super(Deck);
        this.deckRepo = this.repository;
    }

    async getPublicDecks(page: number = 1, limit: number = 10): Promise<Deck[]> {
        const skip = (page - 1) * limit;
        return this.deckRepo.find({
            where: { visibility: "public" },
            relations: ["author"],
            select: {
                id: true,
                name: true,
                description: true,
                visibility: true,
                createdAt: true,
                author: {
                    id: true,
                    username: true,
                },
            },
            skip,
            take: limit,
        });
    }
}