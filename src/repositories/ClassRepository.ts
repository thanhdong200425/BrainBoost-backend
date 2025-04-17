import { Class } from '../entities';
import { BaseRepository } from './BaseRepository';

export class ClassRepository extends BaseRepository<Class> {
    constructor() {
        super(Class);
    }

    async findByEmail(email: string, limit: number = 10): Promise<Class[]> {
        return this.findByRelation('author', { email }, { take: limit });
    }
}
