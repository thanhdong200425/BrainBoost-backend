import { DeepPartial, EntityTarget, FindOptionsWhere, ObjectLiteral, Repository } from "typeorm";
import { AppDataSource } from "../../ormconfig";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

// Use ObjectLiteral to limit the type of T (Generic types)
export abstract class BaseRepository<T extends ObjectLiteral> {
    protected repository: Repository<T>;

    constructor(entity: EntityTarget<T>) {
        this.repository = AppDataSource.getRepository(entity);
    }

    async findAll(): Promise<T[]> {
        return this.repository.find();
    }

    async findById(id: string | number): Promise<T | null> {
        // Cast id to unknown to tell TS compiler forget the type, then cast it to FindOptionsWhere object
        return this.repository.findOneBy({ id } as unknown as FindOptionsWhere<T>);
    }

    async findByCondition(condition: FindOptionsWhere<T>): Promise<T | null> {
        return this.repository.findOneBy(condition);
    }

    async create(data: DeepPartial<T>): Promise<T | unknown> {
        try {
            const entity = this.repository.create(data);
            return this.repository.save(entity);
        } catch (error) {
            return error;
        }
    }

    async update(id: string | number, data: QueryDeepPartialEntity<T>): Promise<T | null> {
        await this.repository.update(id, data);
        return this.findById(id);
    }

    async delete(id: string | number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== undefined && result.affected !== null && result.affected > 0;
    }
}
