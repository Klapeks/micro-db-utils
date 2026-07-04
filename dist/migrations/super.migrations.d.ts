import { DataSource, EntitySchema } from "typeorm";
import { ISQLCommandAdapter, SQLCommandData } from "../sql";
import { DatabaseOptions } from "@klapeks/utils";
type SuperMigrationsSQLParam = string | ISQLCommandAdapter | SQLCommandData | (string | ISQLCommandAdapter | SQLCommandData)[];
export declare class SuperMigrations {
    private static _migrations;
    static get migrationTableName(): string;
    static addRawMigration(dbtype: DatabaseOptions['type'] | 'all', entity: EntitySchema, date: Date | string, sql: SuperMigrationsSQLParam): void;
    static addMigration(entity: EntitySchema, date: Date | string, sql: ISQLCommandAdapter | ISQLCommandAdapter[]): void;
    private static runMigrationForTable;
    static runMigrations(dataSource: DataSource): Promise<void>;
}
export {};
