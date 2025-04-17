import { Repository } from 'typeorm';
import { Deck } from '../entities';
import { BaseRepository } from './BaseRepository';

export class DeckRepository extends BaseRepository<Deck> {
    private deckRepository: Repository<Deck>;

    constructor() {
        super(Deck);
        this.deckRepository = this.repository;
    }

    async getPublicDecks(page: number = 1, limit: number = 10): Promise<Deck[]> {
        const skip = (page - 1) * limit;
        return this.deckRepository.find({
            where: { visibility: 'public' },
            relations: ['author'],
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

    async findByEmail(email: string): Promise<Deck[]> {
        return this.deckRepository.find({
            relations: ['author'],
            where: {
                author: {
                    email: email,
                },
            },
        });
    }
}
