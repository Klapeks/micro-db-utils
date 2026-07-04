import { DataSource, EntitySchema } from "typeorm";
import { AbstractSQLConnection, createSQLConnection, ISQLCommandAdapter, SQLCommandData, toRawSQL } from "../sql";
import { MicroSQL } from "../micro.sql";
import { DatabaseOptions, dataSourceOptions, Logger, mapOf, terminalColors, utils } from "@klapeks/utils";
import { SQLTablesCommands } from "../sql/commands/tables.commands";
import { toISODate } from "../utils/iso.date.time";

const logger = new Logger("SuperMigrations");

type SuperMigrationsSQLParam = string | ISQLCommandAdapter | SQLCommandData | (string | ISQLCommandAdapter | SQLCommandData)[];

export class SuperMigrations {

    private static _migrations: {
        dbtype?: DatabaseOptions['type'] | "all",
        table: string,
        date: Date,
        sql: SuperMigrationsSQLParam
    }[] = []
    
    static get migrationTableName() {
        return process.env.DB_UTILS_MIGRATION_TABLE_NAME || "_kldb_mini_migrations";
    }

    static addRawMigration(
        dbtype: DatabaseOptions['type'] | 'all', 
        entity: EntitySchema, 
        date: Date | string, 
        sql: SuperMigrationsSQLParam
    ) {
        if (typeof date == 'string') date = new Date(date);
        SuperMigrations._migrations.push({
            dbtype: dbtype == 'all' ? undefined : dbtype,
            table: entity.options.tableName || entity.options.name,
            date: date, 
            sql: sql
        });
    }
    static addMigration(
        entity: EntitySchema, 
        date: Date | string, 
        sql: ISQLCommandAdapter | ISQLCommandAdapter[]
    ) {
        SuperMigrations.addRawMigration('all', entity, date, sql);
    }
    

    private static async runMigrationForTable(
        sqlInstance: AbstractSQLConnection,
        table: string,
        lastRealMigrationDateTime: string | null | undefined,
        onMigrationComplete: () => number
    ) {
        const databaseName = sqlInstance.databaseName;
        let todoMigrations = SuperMigrations._migrations.sort((c1, c2) => c1.date.getTime() - c2.date.getTime());
        todoMigrations = [...todoMigrations].filter(m => m.table == table);
        
        const isTableExistsInfo = await await sqlInstance.runSQL_One(
            SQLTablesCommands.tableInfo(databaseName, table));

        if (!isTableExistsInfo) {
            const firstSQL = (() => {
                let sql = todoMigrations?.[0]?.sql;
                if (!sql) return null;
                if (Array.isArray(sql)) sql = sql[0];
                return sqlInstance.toRawSQL(sql);
            })();
            if (!firstSQL?.query?.toLowerCase()?.includes('create table')) {
                logger.log(`Table ${table} not found. Migrations ${todoMigrations?.length} will be skipped`);
                const lastMigrationDate = todoMigrations.length ? todoMigrations?.[todoMigrations.length - 1]?.date : undefined;
                if (todoMigrations?.length && lastMigrationDate) {
                    await sqlInstance.runSQL(
                        MicroSQL.editData(this.migrationTableName).upsert({
                            table, lastMigrationDate: toISODate(lastMigrationDate)
                        }, ['table'])
                    );
                }
                return;
            }
        }

        const _local_runSQL = async (sql: string, params?: any) => {
            if (sql.toLowerCase().startsWith("alter table")) {
                // log error if error
                await sqlInstance.runSQL(sql, params).catch(err => {
                    logger.error("Error while alter table:", err);
                });
            } else {
                // throw error if error
                await sqlInstance.runSQL(sql, params); 
            }
        }

        const lastRealMigration = lastRealMigrationDateTime
            ? new Date(lastRealMigrationDateTime) : null;

        for (let migration of todoMigrations) {
            if (migration.table != table) continue;
            if (lastRealMigration && lastRealMigration.getTime() >= migration.date.getTime()) {
                continue;
            }
            const runnedMigrationsAmount = onMigrationComplete();
            const migrationName = '"' + table + ' ' + toISODate(migration.date)+ '"';
            if (Array.isArray(migration.sql)) {
                const sqls = migration.sql.filter(Boolean).map(sql => {
                    const sql2 = sqlInstance.toRawSQL(sql);
                    sql2.query = utils.replaceAll(
                        sql2.query.trim(), "%{table_name}", table
                    );
                    return sql2;
                });
                logger.log(runnedMigrationsAmount, "| Migrations will be runned:",
                        migrationName, '|\n' + terminalColors.cyan, sqls);
                for (let sql of sqls) await _local_runSQL(sql.query, sql.params);
            } else {
                const sql = sqlInstance.toRawSQL(migration.sql);
                sql.query = utils.replaceAll(sql.query.trim(), "%{table_name}", table);
                logger.log(runnedMigrationsAmount, "| Migration will be runned:", 
                        migrationName, '|\n' + terminalColors.cyan, sql.query);
                await _local_runSQL(sql.query, sql.params);
            }
            await sqlInstance.runSQL(
                MicroSQL.editData(this.migrationTableName).upsert({
                    table, lastMigrationDate: toISODate(migration.date)
                }, ['table'])
            );
            logger.log(runnedMigrationsAmount, "| Migration", migrationName, "successfully done");
            await utils.sleep(100);
        }

        logger.log("Is table exists info:", isTableExistsInfo)
    }

    static async runMigrations(dataSource: DataSource) {
        const options = dataSourceOptions();
        try {
            const sqlInstance = createSQLConnection(options);
            await sqlInstance.initConnection();

            try {
                { // migration table checking
                    // check if migration table exists
                    const _existsMigrationTable = await sqlInstance
                    .runSQL_One(SQLTablesCommands.tableInfo(
                        options.database, SuperMigrations.migrationTableName
                    ));
                    logger.debug("Migrations table info:", _existsMigrationTable);
                    if (!_existsMigrationTable) {
                        // creating migration table if not exists
                        logger.log("Creating migration table..");
                        await sqlInstance.runSQL_One(
                            SQLTablesCommands.createTable({
                                table: SuperMigrations.migrationTableName,
                                columns: {
                                    table: { type: String, length: 255, primary: true },
                                    lastMigrationTime: { type: String, length: 128 }
                                }
                            })
                        );
                    }
                }

                // pre running migrations
                const migrationRecords = mapOf(await sqlInstance.runSQL(
                    MicroSQL.select(SuperMigrations.migrationTableName).all()
                ), 'table');
                logger.log('Migration records:', migrationRecords);

                // run migrations of all tables;
                let runnedMigrationsAmount = 0;
                const tablesToMigrate = Object.values(dataSource.options.entities || []).map((m: any) => {
                    if (m instanceof EntitySchema) return m.options.name;
                    return undefined;
                }).filter(Boolean) as string[];
                for (let table of tablesToMigrate) {
                    await SuperMigrations.runMigrationForTable(
                        sqlInstance, table, 
                        migrationRecords.get(table),
                        () => ++runnedMigrationsAmount
                    );
                }
                if (runnedMigrationsAmount) {
                    logger.log(terminalColors.green + "All migrations completed:" 
                        + terminalColors.reset, runnedMigrationsAmount);
                }

                await sqlInstance.destroyConnection().catch(err => {
                    logger.error("Error while closing pool:", err);
                });
            } catch (err: any) {
                await sqlInstance.destroyConnection().catch(err => {
                    logger.error("Error while closing pool:", err);
                });
                throw err;
            }
        } catch (err: any) {
            if ((err?.sqlMessage as string)?.toLowerCase()
                .includes("unknown database")) return;
            // logger.error("err of musql:", err.sqlMessage);
            throw err;
        }
    }
}

SuperMigrations.addMigration = SuperMigrations.addMigration.bind(SuperMigrations);
SuperMigrations.addRawMigration = SuperMigrations.addRawMigration.bind(SuperMigrations);
SuperMigrations.runMigrations = SuperMigrations.runMigrations.bind(SuperMigrations);