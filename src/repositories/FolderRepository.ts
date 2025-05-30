import { Folder } from '../entities';
import { BaseRepository } from './BaseRepository';

export class FolderRepository extends BaseRepository<Folder> {
    constructor() {
        super(Folder);
    }

    async findByEmail(email: string, limit: number = 10): Promise<Folder[]> {
        return this.findByRelation('author', { email }, { take: limit });
    }

    async findByUserId(id: number, limit: number | 'all' = 10): Promise<Folder[]> {
        if (limit === 'all') return this.findByRelation('author', { id });
        return this.findByRelation('author', { id }, { take: limit });
    }

    async countByUserId(userId: number): Promise<number> {
        return this.repository
            .createQueryBuilder('folder')
            .where('folder.author_id = :userId', { userId })
            .getCount();
    }
}
