import { Deck } from '../entities';
import { BaseRepository } from './BaseRepository';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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

    async findById(id: string): Promise<Deck | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['author'],
        });
    }

    async update(id: string, data: QueryDeepPartialEntity<Deck>): Promise<Deck | null> {
        await this.repository.update(id, data);
        return this.findById(id);
    }
}
