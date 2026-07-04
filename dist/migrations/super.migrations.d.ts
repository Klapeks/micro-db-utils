import { DataSource, EntitySchema } from "typeorm";
import { ISQLCommandAdapter } from "../sql";
import { DatabaseOptions } from "@klapeks/utils";
type SuperMigrationsSQLParam = string | ISQLCommandAdapter | (string | ISQLCommandAdapter)[];
export declare class SuperMigrations {
    private static _migrations;
    static get migrationTableName(): string;
    static addMigration(dbtype: DatabaseOptions['type'] | 'all', entity: EntitySchema, date: Date | string, sql: SuperMigrationsSQLParam): void;
    static runMigrations(dataSource: DataSource): Promise<void>;
}
export {};
