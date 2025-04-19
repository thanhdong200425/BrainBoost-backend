import { Deck } from '../entities';
import { BaseRepository } from './BaseRepository';

export class DeckRepository extends BaseRepository<Deck> {
    constructor() {
        super(Deck);
    }

    async findByEmail(email: string, limit: number = 10): Promise<Deck[]> {
        return this.findByRelation('author', { email }, { take: limit });
    }

    async findByUserId(id: number, limit: number | 'all' = 10): Promise<Deck[]> {
        if (limit === 'all') return this.findByRelation('author', { id });
        return this.findByRelation('author', { id }, { take: limit });
    }
}
