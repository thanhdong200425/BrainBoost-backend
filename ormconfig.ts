import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "dong",
    database: "brainboost",
    synchronize: true,
    logging: true,
    entities: ['src/entities/*.ts'],
    migrations: ['src/migrations/*.ts']
})