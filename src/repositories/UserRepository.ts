import { User } from "../entities";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.findByCondition({ email });
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.findByCondition({ username });
    }
}
