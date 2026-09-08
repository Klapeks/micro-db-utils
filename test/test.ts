// import mPath from 'path';

// const DB_PATH = mPath.join(__dirname, './test.sqlite');
// process.env.DATABASE_TYPE = 'sqlite';
// process.env.DATABASE_PATH = DB_PATH;

// import { MicroSQL, MULTISQL_COLUMNS_TYPES, SQLiteConnection } from '../src/index';
// import { logger } from '@klapeks/utils';

// async function start() {

//     const sqlite = new SQLiteConnection({
//         type: "sqlite",
//         database: DB_PATH,
//         logging: true,
//     });

    
//     logger.log('SQL 1:', await sqlite.runSQL(MicroSQL.tables().tableInfo('-', 'test_1')))

//     await sqlite.runSQL(
//         MicroSQL.alter('test_1').changeColumnType('name', { type: String, length: 512 })
//     );

//     logger.log('SQL 2:', await sqlite.runSQL(MicroSQL.tables().tableInfo('-', 'test_1')))
//     await sqlite.destroyConnection();
// }
// start().catch(err => {
//     logger.error("Error:", err);
// }).finally(() => {
//     process.exit(0);
// });