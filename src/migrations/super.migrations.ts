import { DataSource, EntitySchema } from "typeorm";
import { createSQLConnection, ISQLCommandAdapter } from "../sql";
import { MicroSQL } from "../micro.sql";
import { dataSourceOptions, Logger, mapOf, terminalColors } from "@klapeks/utils";
import { SQLTablesCommands } from "../sql/commands/tables.commands";

const logger = new Logger("SuperMigrations");

type SuperMigrationsSQLParam = string | ISQLCommandAdapter | (string | ISQLCommandAdapter)[];

export class SuperMigrations {

    private static _migrations: {
        table: string,
        date: Date,
        sql: SuperMigrationsSQLParam
    }[] = []
    
    static get migrationTableName() {
        return process.env.DB_UTILS_MIGRATION_TABLE_NAME || "_kldb_mini_migrations";
    }

    static addMigration(entity: EntitySchema, date: Date, sql: SuperMigrationsSQLParam) {
        this._migrations.push({
            table: entity.options.tableName || entity.options.name,
            date: date, sql: sql
        });
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
                        options.database, this.migrationTableName
                    ));
                    logger.debug("Migrations table info:", _existsMigrationTable);
                    if (!_existsMigrationTable) {
                        // creating migration table if not exists
                        logger.log("Creating migration table..");
                        await sqlInstance.runSQL_One(
                            SQLTablesCommands.createTable({
                                table: this.migrationTableName,
                                columns: {
                                    table: { type: String, length: 255, primary: true },
                                    lastMigrationTime: { type: String, length: 128 }
                                }
                            })
                        );
                    }
                }


                // pre running migrations
                const migrationRecors = mapOf(await sqlInstance.runSQL(
                    MicroSQL.select(this.migrationTableName).all()
                ), 'table');
                logger.log('Migration records:', migrationRecors);


                // runnging table migration function
                let runnedMigrationsAmount = 0;
                const runTableMigration = async (table: string) => {
                }


                // run migrations of all tables;
                const tablesToMigrate = Object.values(dataSource.options.entities || []).map((m: any) => {
                    if (m instanceof EntitySchema) return m.options.name;
                    return undefined;
                }).filter(Boolean) as string[];
                for (let table of tablesToMigrate) {
                    await runTableMigration(table);
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