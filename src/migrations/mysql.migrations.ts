import { DataSource, EntitySchema } from "typeorm";
import { RawMySQLConnection } from '../connections/mysql.connection';
import mysql from 'mysql2';
import { dataSourceOptions, Logger, terminalColors, utils } from "@klapeks/utils";
import { toISODate } from "../utils/iso.date.time";

// for mysql
// export type 
const _migrations: {
    table: string,
    date: Date,
    sql: string | string[]
}[] = [];

const logger = new Logger("MySQL Migrations");

export class MySQLMigrations {

    static get migrationTableName() {
        return process.env.DB_UTILS_MIGRATION_TABLE_NAME || "_kldb_mini_migrations";
    }

    static addMigration(entity: EntitySchema, date: Date, sql: string | string[]) {
        _migrations.push({
            table: entity.options.tableName || entity.options.name,
            date, sql
        });
    }

    private static checkIsCreatesTable(migrations: string | string[]): boolean {
        if (!migrations) return false;
        if (Array.isArray(migrations)) return this.checkIsCreatesTable(migrations[0]);
        return migrations.toLowerCase().startsWith('create table');
    }

    static async runMigrations(dataSource: DataSource) {
        try {
            const options = dataSourceOptions();
            const mysqlInstance = new RawMySQLConnection(options as any);
            await mysqlInstance.takePool();
        
            const getTable = async (table: string) => {
                return mysqlInstance.runSQL_One(`
                    SELECT * FROM information_schema.tables
                    WHERE table_schema = '${options.database}' 
                        AND table_name = '${table}'
                    LIMIT 1;
                `);
            }
        
            const hasMigrationTable = await getTable(this.migrationTableName);
            if (!hasMigrationTable) {
                logger.log("Creating migration table..");
                await mysqlInstance.runSQL(`
                    CREATE TABLE ${this.migrationTableName} (
                        \`table\` VARCHAR(255) NOT NULL PRIMARY KEY,
                        \`lastMigrationTime\` VARCHAR(128) NOT NULL
                    )
                `);
            }
        
            const migrationRecords = await mysqlInstance.runSQL(`SELECT * FROM ${this.migrationTableName}`);
            let runnedMigrationsAmount = 0;
            const runTableMigration = async (table: string) => {
                let todoMigrations = _migrations.sort((c1, c2) => c1.date.getTime() - c2.date.getTime());
                todoMigrations = [...todoMigrations].filter(m => m.table == table);
        
                const isTableExistsInfo = await getTable(table);
                
                if (!isTableExistsInfo && !this.checkIsCreatesTable(todoMigrations?.[0]?.sql)) {
                    logger.log(`Table ${table} not found. Migrations ${todoMigrations?.length} will be skipped`);
                    const lastMigrationDate = todoMigrations.length ? todoMigrations?.[todoMigrations.length - 1]?.date : undefined;
                    if (todoMigrations?.length && lastMigrationDate) {
                        await mysqlInstance.runSQL(`
                            INSERT INTO \`${this.migrationTableName}\` (\`table\`, \`lastMigrationTime\`)
                            VALUES ('${table}', '${toISODate(lastMigrationDate)}')
                            ON DUPLICATE KEY UPDATE \`lastMigrationTime\` = '${toISODate(lastMigrationDate)}'
                        `);
                    }
                    return;
                }
                const lastRealMigration = migrationRecords?.find(r => r.table == table)?.lastMigrationTime as string;
                const _local_runSQL = async (sql: string) => {
                    if (sql.toLowerCase().startsWith("alter table")) {
                        // log error if error
                        await mysqlInstance.runSQL(sql).catch(err => {
                            logger.error("Error while alter table:", err);
                        });
                    } else {
                        // throw error if error
                        await mysqlInstance.runSQL(sql); 
                    }
                }
                for (let migration of todoMigrations) {
                    if (migration.table != table) continue;
                    if (lastRealMigration && new Date(lastRealMigration).getTime() >= migration.date.getTime()) {
                        continue;
                    }
                    runnedMigrationsAmount += 1;
                    const migrationName = '"' + table + ' ' + toISODate(migration.date)+ '"';
                    if (Array.isArray(migration.sql)) {
                        const sqls = migration.sql.filter(Boolean).map(sql => {
                            return utils.replaceAll(sql.trim(), "%{table_name}", table);
                        });
                        logger.log(runnedMigrationsAmount, "| Migrations will be runned:",
                                migrationName, '|\n' + terminalColors.cyan, sqls);
                        for (let sql of sqls) await _local_runSQL(sql);
                    } else {
                        const sql = utils.replaceAll(migration.sql, "%{table_name}", table);
                        logger.log(runnedMigrationsAmount, "| Migration will be runned:", 
                                migrationName, '|\n' + terminalColors.cyan, sql.trim());
                        await _local_runSQL(sql);
                    }
                    await mysqlInstance.runSQL(`
                        INSERT INTO \`${this.migrationTableName}\` (\`table\`, \`lastMigrationTime\`)
                        VALUES ('${table}', '${toISODate(migration.date)}')
                        ON DUPLICATE KEY UPDATE \`lastMigrationTime\` = '${toISODate(migration.date)}'
                    `);
                    logger.log(runnedMigrationsAmount, "| Migration", migrationName, "successfully done");
                    await utils.sleep(100);
                }
            }
        
            const tablesToMigrate = Object.values(dataSource.options.entities || []).map((m: any) => {
                if (m instanceof EntitySchema) return m.options.name;
                return undefined;
            }).filter(Boolean) as string[];
            for (let table of tablesToMigrate) {
                await runTableMigration(table);
            }
            if (runnedMigrationsAmount) {
                logger.log("All migrations completed:", runnedMigrationsAmount);
            }
        
            await mysqlInstance.destroyConnection().catch(err => {
                logger.error("Error while closing pool:", err);
            });
        } catch (err: any) {
            if ((err?.sqlMessage as string)?.toLowerCase()
                .includes("unknown database")) return;
            // logger.error("err of musql:", err.sqlMessage);
            throw err;
        }
    }
}