import { DataSource, EntitySchema } from "typeorm";
export declare class MySQLMigrations {
    static addMigration(entity: EntitySchema, date: Date, sql: string | string[]): void;
    static runMigrations(dataSource: DataSource): Promise<void>;
}
