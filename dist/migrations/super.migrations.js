"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperMigrations = void 0;
var typeorm_1 = require("typeorm");
var sql_1 = require("../sql");
var micro_sql_1 = require("../micro.sql");
var utils_1 = require("@klapeks/utils");
var tables_commands_1 = require("../sql/commands/tables.commands");
var iso_date_time_1 = require("../utils/iso.date.time");
var logger = new utils_1.Logger("SuperMigrations");
var SuperMigrations = /** @class */ (function () {
    function SuperMigrations() {
    }
    Object.defineProperty(SuperMigrations, "migrationTableName", {
        get: function () {
            return process.env.DB_UTILS_MIGRATION_TABLE_NAME || "_kldb_mini_migrations";
        },
        enumerable: false,
        configurable: true
    });
    SuperMigrations.addRawMigration = function (dbtype, entity, date, sql) {
        if (typeof date == 'string')
            date = new Date(date);
        SuperMigrations._migrations.push({
            dbtype: dbtype == 'all' ? undefined : dbtype,
            table: entity.options.tableName || entity.options.name,
            date: date,
            sql: sql
        });
    };
    SuperMigrations.addMigration = function (entity, date, sql) {
        SuperMigrations.addRawMigration('all', entity, date, sql);
    };
    SuperMigrations.runMigrationForTable = function (sqlInstance, table, lastRealMigrationDateTime, onMigrationComplete) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var databaseName, todoMigrations, isTableExistsInfo, firstSQL, lastMigrationDate, _local_runSQL, lastRealMigration, _i, todoMigrations_1, migration, runnedMigrationsAmount, migrationName, sqls, _d, sqls_1, sql, sql;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        databaseName = sqlInstance.databaseName;
                        todoMigrations = SuperMigrations._migrations.sort(function (c1, c2) { return c1.date.getTime() - c2.date.getTime(); });
                        todoMigrations = __spreadArray([], todoMigrations, true).filter(function (m) { return m.table == table; });
                        return [4 /*yield*/, sqlInstance.runSQL_One(tables_commands_1.SQLTablesCommands.tableInfo(databaseName, table))];
                    case 1: return [4 /*yield*/, _e.sent()];
                    case 2:
                        isTableExistsInfo = _e.sent();
                        if (!!isTableExistsInfo) return [3 /*break*/, 5];
                        firstSQL = (function () {
                            var _a;
                            var sql = (_a = todoMigrations === null || todoMigrations === void 0 ? void 0 : todoMigrations[0]) === null || _a === void 0 ? void 0 : _a.sql;
                            if (!sql)
                                return null;
                            if (Array.isArray(sql))
                                sql = sql[0];
                            return sqlInstance.toRawSQL(sql);
                        })();
                        if (!!((_b = (_a = firstSQL === null || firstSQL === void 0 ? void 0 : firstSQL.query) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes('create table'))) return [3 /*break*/, 5];
                        logger.log("Table ".concat(table, " not found. Migrations ").concat(todoMigrations === null || todoMigrations === void 0 ? void 0 : todoMigrations.length, " will be skipped"));
                        lastMigrationDate = todoMigrations.length ? (_c = todoMigrations === null || todoMigrations === void 0 ? void 0 : todoMigrations[todoMigrations.length - 1]) === null || _c === void 0 ? void 0 : _c.date : undefined;
                        if (!((todoMigrations === null || todoMigrations === void 0 ? void 0 : todoMigrations.length) && lastMigrationDate)) return [3 /*break*/, 4];
                        return [4 /*yield*/, sqlInstance.runSQL(micro_sql_1.MicroSQL.editData(this.migrationTableName).upsert({
                                table: table,
                                lastMigrationDate: (0, iso_date_time_1.toISODate)(lastMigrationDate)
                            }, ['table']))];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4: return [2 /*return*/];
                    case 5:
                        _local_runSQL = function (sql, params) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!sql.toLowerCase().startsWith("alter table")) return [3 /*break*/, 2];
                                        // log error if error
                                        return [4 /*yield*/, sqlInstance.runSQL(sql, params).catch(function (err) {
                                                logger.error("Error while alter table:", err);
                                            })];
                                    case 1:
                                        // log error if error
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 2: 
                                    // throw error if error
                                    return [4 /*yield*/, sqlInstance.runSQL(sql, params)];
                                    case 3:
                                        // throw error if error
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); };
                        lastRealMigration = lastRealMigrationDateTime
                            ? new Date(lastRealMigrationDateTime) : null;
                        _i = 0, todoMigrations_1 = todoMigrations;
                        _e.label = 6;
                    case 6:
                        if (!(_i < todoMigrations_1.length)) return [3 /*break*/, 17];
                        migration = todoMigrations_1[_i];
                        if (migration.table != table)
                            return [3 /*break*/, 16];
                        if (lastRealMigration && lastRealMigration.getTime() >= migration.date.getTime()) {
                            return [3 /*break*/, 16];
                        }
                        runnedMigrationsAmount = onMigrationComplete();
                        migrationName = '"' + table + ' ' + (0, iso_date_time_1.toISODate)(migration.date) + '"';
                        if (!Array.isArray(migration.sql)) return [3 /*break*/, 11];
                        sqls = migration.sql.filter(Boolean).map(function (sql) {
                            var sql2 = sqlInstance.toRawSQL(sql);
                            sql2.query = utils_1.utils.replaceAll(sql2.query.trim(), "%{table_name}", table);
                            return sql2;
                        });
                        logger.log(runnedMigrationsAmount, "| Migrations will be runned:", migrationName, '|\n' + utils_1.terminalColors.cyan, sqls);
                        _d = 0, sqls_1 = sqls;
                        _e.label = 7;
                    case 7:
                        if (!(_d < sqls_1.length)) return [3 /*break*/, 10];
                        sql = sqls_1[_d];
                        return [4 /*yield*/, _local_runSQL(sql.query, sql.params)];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9:
                        _d++;
                        return [3 /*break*/, 7];
                    case 10: return [3 /*break*/, 13];
                    case 11:
                        sql = sqlInstance.toRawSQL(migration.sql);
                        sql.query = utils_1.utils.replaceAll(sql.query.trim(), "%{table_name}", table);
                        logger.log(runnedMigrationsAmount, "| Migration will be runned:", migrationName, '|\n' + utils_1.terminalColors.cyan, sql.query);
                        return [4 /*yield*/, _local_runSQL(sql.query, sql.params)];
                    case 12:
                        _e.sent();
                        _e.label = 13;
                    case 13: return [4 /*yield*/, sqlInstance.runSQL(micro_sql_1.MicroSQL.editData(this.migrationTableName).upsert({
                            table: table,
                            lastMigrationDate: (0, iso_date_time_1.toISODate)(migration.date)
                        }, ['table']))];
                    case 14:
                        _e.sent();
                        logger.log(runnedMigrationsAmount, "| Migration", migrationName, "successfully done");
                        return [4 /*yield*/, utils_1.utils.sleep(100)];
                    case 15:
                        _e.sent();
                        _e.label = 16;
                    case 16:
                        _i++;
                        return [3 /*break*/, 6];
                    case 17:
                        logger.log("Is table exists info:", isTableExistsInfo);
                        return [2 /*return*/];
                }
            });
        });
    };
    SuperMigrations.runMigrations = function (dataSource) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var options, sqlInstance, _existsMigrationTable, migrationRecords, _b, runnedMigrationsAmount_1, tablesToMigrate, _i, tablesToMigrate_1, table, err_1, err_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        options = (0, utils_1.dataSourceOptions)();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 16, , 17]);
                        sqlInstance = (0, sql_1.createSQLConnection)(options);
                        return [4 /*yield*/, sqlInstance.initConnection()];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 13, , 15]);
                        return [4 /*yield*/, sqlInstance
                                .runSQL_One(tables_commands_1.SQLTablesCommands.tableInfo(options.database, SuperMigrations.migrationTableName))];
                    case 4:
                        _existsMigrationTable = _c.sent();
                        logger.debug("Migrations table info:", _existsMigrationTable);
                        if (!!_existsMigrationTable) return [3 /*break*/, 6];
                        // creating migration table if not exists
                        logger.log("Creating migration table..");
                        return [4 /*yield*/, sqlInstance.runSQL_One(tables_commands_1.SQLTablesCommands.createTable({
                                table: SuperMigrations.migrationTableName,
                                columns: {
                                    table: { type: String, length: 255, primary: true },
                                    lastMigrationTime: { type: String, length: 128 }
                                }
                            }))];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        _b = utils_1.mapOf;
                        return [4 /*yield*/, sqlInstance.runSQL(micro_sql_1.MicroSQL.select(SuperMigrations.migrationTableName).all())];
                    case 7:
                        migrationRecords = _b.apply(void 0, [_c.sent(), 'table']);
                        logger.log('Migration records:', migrationRecords);
                        runnedMigrationsAmount_1 = 0;
                        tablesToMigrate = Object.values(dataSource.options.entities || []).map(function (m) {
                            if (m instanceof typeorm_1.EntitySchema)
                                return m.options.name;
                            return undefined;
                        }).filter(Boolean);
                        _i = 0, tablesToMigrate_1 = tablesToMigrate;
                        _c.label = 8;
                    case 8:
                        if (!(_i < tablesToMigrate_1.length)) return [3 /*break*/, 11];
                        table = tablesToMigrate_1[_i];
                        return [4 /*yield*/, SuperMigrations.runMigrationForTable(sqlInstance, table, migrationRecords.get(table), function () { return ++runnedMigrationsAmount_1; })];
                    case 9:
                        _c.sent();
                        _c.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 8];
                    case 11:
                        if (runnedMigrationsAmount_1) {
                            logger.log(utils_1.terminalColors.green + "All migrations completed:"
                                + utils_1.terminalColors.reset, runnedMigrationsAmount_1);
                        }
                        return [4 /*yield*/, sqlInstance.destroyConnection().catch(function (err) {
                                logger.error("Error while closing pool:", err);
                            })];
                    case 12:
                        _c.sent();
                        return [3 /*break*/, 15];
                    case 13:
                        err_1 = _c.sent();
                        return [4 /*yield*/, sqlInstance.destroyConnection().catch(function (err) {
                                logger.error("Error while closing pool:", err);
                            })];
                    case 14:
                        _c.sent();
                        throw err_1;
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        err_2 = _c.sent();
                        if ((_a = err_2 === null || err_2 === void 0 ? void 0 : err_2.sqlMessage) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("unknown database"))
                            return [2 /*return*/];
                        // logger.error("err of musql:", err.sqlMessage);
                        throw err_2;
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    SuperMigrations._migrations = [];
    return SuperMigrations;
}());
exports.SuperMigrations = SuperMigrations;
SuperMigrations.addMigration = SuperMigrations.addMigration.bind(SuperMigrations);
SuperMigrations.addRawMigration = SuperMigrations.addRawMigration.bind(SuperMigrations);
SuperMigrations.runMigrations = SuperMigrations.runMigrations.bind(SuperMigrations);
