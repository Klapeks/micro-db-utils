import { DataSource, EntitySchema } from "typeorm";
import { ISQLCommandAdapter } from "../sql";
type SuperMigrationsSQLParam = string | ISQLCommandAdapter | (string | ISQLCommandAdapter)[];
export declare class SuperMigrations {
    private static _migrations;
    static get migrationTableName(): string;
    static addMigration(entity: EntitySchema, date: Date, sql: SuperMigrationsSQLParam): void;
    static runMigrations(dataSource: DataSource): Promise<void>;
}
export {};
