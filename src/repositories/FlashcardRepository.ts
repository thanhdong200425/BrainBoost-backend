import { Flashcard } from '../entities';
import { BaseRepository } from './BaseRepository';

export class FlashcardRepository extends BaseRepository<Flashcard> {
    constructor() {
        super(Flashcard);
    }

    async findByDeckId(deckId: string, limit: number | 'all' = 10): Promise<Flashcard[]> {
        if (limit === 'all') return this.findByRelation('deck', { id: deckId });
        return this.findByRelation('deck', { id: deckId }, { take: limit });
    }

    async findById(id: string): Promise<Flashcard | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['deck'],
        });
    }

    async createMany(flashcards: Partial<Flashcard>[]): Promise<Flashcard[]> {
        const flashcardEntities = this.repository.create(flashcards);
        return this.repository.save(flashcardEntities);
    }
}
