import { Deck } from '../entities';
import { BaseRepository } from './BaseRepository';

export class DeckRepository extends BaseRepository<Deck> {
    constructor() {
        super(Deck);
    }

    async findByEmail(email: string, limit: number = 10): Promise<Deck[]> {
        return this.findByRelation('author', { email }, { take: limit });
    }
}
