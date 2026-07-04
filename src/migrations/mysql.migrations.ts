import { DataSource, EntitySchema } from "typeorm";
import { SuperMigrations } from "./super.migrations";

export class MySQLMigrations {

    static addMigration(entity: EntitySchema, date: Date, sql: string | string[]) {
        SuperMigrations.addRawMigration('mysql', entity, date, sql);
    }
    static async runMigrations(dataSource: DataSource) {
        return await SuperMigrations.runMigrations(dataSource);
    }
}