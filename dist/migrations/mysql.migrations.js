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
exports.MySQLMigrations = void 0;
var typeorm_1 = require("typeorm");
var mysql_connection_1 = require("../connections/mysql.connection");
var utils_1 = require("@klapeks/utils");
var iso_date_time_1 = require("../utils/iso.date.time");
// for mysql
// export type 
var _migrations = [];
var logger = new utils_1.Logger("MySQL Migrations");
var MySQLMigrations = /** @class */ (function () {
    function MySQLMigrations() {
    }
    Object.defineProperty(MySQLMigrations, "migrationTableName", {
        get: function () {
            return process.env.DB_UTILS_MIGRATION_TABLE_NAME || "_kldb_mini_migrations";
        },
        enumerable: false,
        configurable: true
    });
    MySQLMigrations.addMigration = function (entity, date, sql) {
        _migrations.push({
            table: entity.options.tableName || entity.options.name,
            date: date,
            sql: sql
        });
    };
    MySQLMigrations.runMigrations = function (dataSource) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var options_1, mysqlInstance_1, getTable_1, hasMigrationTable, migrationRecords_1, runnedMigrationsAmount_1, runTableMigration, tablesToMigrate, _i, tablesToMigrate_1, table, err_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 11, , 12]);
                        options_1 = (0, utils_1.dataSourceOptions)();
                        mysqlInstance_1 = new mysql_connection_1.RawMySQLConnection(options_1);
                        return [4 /*yield*/, mysqlInstance_1.takePool()];
                    case 1:
                        _b.sent();
                        getTable_1 = function (table) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, mysqlInstance_1.runSQL_One("\n                    SELECT * FROM information_schema.tables\n                    WHERE table_schema = '".concat(options_1.database, "' \n                        AND table_name = '").concat(table, "'\n                    LIMIT 1;\n                "))];
                            });
                        }); };
                        return [4 /*yield*/, getTable_1(this.migrationTableName)];
                    case 2:
                        hasMigrationTable = _b.sent();
                        if (!!hasMigrationTable) return [3 /*break*/, 4];
                        logger.log("Creating migration table..");
                        return [4 /*yield*/, mysqlInstance_1.runSQL("\n                    CREATE TABLE ".concat(this.migrationTableName, " (\n                        `table` VARCHAR(255) NOT NULL PRIMARY KEY,\n                        `lastMigrationTime` VARCHAR(128) NOT NULL\n                    )\n                "))];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [4 /*yield*/, mysqlInstance_1.runSQL("SELECT * FROM ".concat(this.migrationTableName))];
                    case 5:
                        migrationRecords_1 = _b.sent();
                        runnedMigrationsAmount_1 = 0;
                        runTableMigration = function (table) { return __awaiter(_this, void 0, void 0, function () {
                            var todoMigrations, tableInfo, lastMigrationDate, lastRealMigration, _local_runSQL, _i, todoMigrations_1, migration, migrationName, sqls, _a, sqls_1, sql, sql;
                            var _this = this;
                            var _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        todoMigrations = _migrations.sort(function (c1, c2) { return c1.date.getTime() - c2.date.getTime(); });
                                        todoMigrations = __spreadArray([], todoMigrations, true).filter(function (m) { return m.table == table; });
                                        return [4 /*yield*/, getTable_1(table)];
                                    case 1:
                                        tableInfo = _d.sent();
                                        if (!!tableInfo) return [3 /*break*/, 4];
                                        logger.log("Table ".concat(table, " not found. Migrations ").concat(todoMigrations === null || todoMigrations === void 0 ? void 0 : todoMigrations.length, " will be skipped"));
                                        lastMigrationDate = todoMigrations.length ? (_b = todoMigrations === null || todoMigrations === void 0 ? void 0 : todoMigrations[todoMigrations.length - 1]) === null || _b === void 0 ? void 0 : _b.date : undefined;
                                        if (!((todoMigrations === null || todoMigrations === void 0 ? void 0 : todoMigrations.length) && lastMigrationDate)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, mysqlInstance_1.runSQL("\n                            INSERT INTO `".concat(this.migrationTableName, "` (`table`, `lastMigrationTime`)\n                            VALUES ('").concat(table, "', '").concat((0, iso_date_time_1.toISODate)(lastMigrationDate), "')\n                            ON DUPLICATE KEY UPDATE `lastMigrationTime` = '").concat((0, iso_date_time_1.toISODate)(lastMigrationDate), "'\n                        "))];
                                    case 2:
                                        _d.sent();
                                        _d.label = 3;
                                    case 3: return [2 /*return*/];
                                    case 4:
                                        lastRealMigration = (_c = migrationRecords_1 === null || migrationRecords_1 === void 0 ? void 0 : migrationRecords_1.find(function (r) { return r.table == table; })) === null || _c === void 0 ? void 0 : _c.lastMigrationTime;
                                        _local_runSQL = function (sql) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!sql.toLowerCase().startsWith("alter table")) return [3 /*break*/, 2];
                                                        // log error if error
                                                        return [4 /*yield*/, mysqlInstance_1.runSQL(sql).catch(function (err) {
                                                                logger.error("Error while alter table:", err);
                                                            })];
                                                    case 1:
                                                        // log error if error
                                                        _a.sent();
                                                        return [3 /*break*/, 4];
                                                    case 2: 
                                                    // throw error if error
                                                    return [4 /*yield*/, mysqlInstance_1.runSQL(sql)];
                                                    case 3:
                                                        // throw error if error
                                                        _a.sent();
                                                        _a.label = 4;
                                                    case 4: return [2 /*return*/];
                                                }
                                            });
                                        }); };
                                        _i = 0, todoMigrations_1 = todoMigrations;
                                        _d.label = 5;
                                    case 5:
                                        if (!(_i < todoMigrations_1.length)) return [3 /*break*/, 16];
                                        migration = todoMigrations_1[_i];
                                        if (migration.table != table)
                                            return [3 /*break*/, 15];
                                        if (lastRealMigration && new Date(lastRealMigration).getTime() >= migration.date.getTime()) {
                                            return [3 /*break*/, 15];
                                        }
                                        runnedMigrationsAmount_1 += 1;
                                        migrationName = '"' + table + ' ' + (0, iso_date_time_1.toISODate)(migration.date) + '"';
                                        if (!Array.isArray(migration.sql)) return [3 /*break*/, 10];
                                        sqls = migration.sql.filter(Boolean).map(function (sql) {
                                            return utils_1.utils.replaceAll(sql.trim(), "%{table_name}", table);
                                        });
                                        logger.log(runnedMigrationsAmount_1, "| Migrations will be runned:", migrationName, '|\n' + utils_1.terminalColors.cyan, sqls);
                                        _a = 0, sqls_1 = sqls;
                                        _d.label = 6;
                                    case 6:
                                        if (!(_a < sqls_1.length)) return [3 /*break*/, 9];
                                        sql = sqls_1[_a];
                                        return [4 /*yield*/, _local_runSQL(sql)];
                                    case 7:
                                        _d.sent();
                                        _d.label = 8;
                                    case 8:
                                        _a++;
                                        return [3 /*break*/, 6];
                                    case 9: return [3 /*break*/, 12];
                                    case 10:
                                        sql = utils_1.utils.replaceAll(migration.sql, "%{table_name}", table);
                                        logger.log(runnedMigrationsAmount_1, "| Migration will be runned:", migrationName, '|\n' + utils_1.terminalColors.cyan, sql.trim());
                                        return [4 /*yield*/, _local_runSQL(sql)];
                                    case 11:
                                        _d.sent();
                                        _d.label = 12;
                                    case 12: return [4 /*yield*/, mysqlInstance_1.runSQL("\n                        INSERT INTO `".concat(this.migrationTableName, "` (`table`, `lastMigrationTime`)\n                        VALUES ('").concat(table, "', '").concat((0, iso_date_time_1.toISODate)(migration.date), "')\n                        ON DUPLICATE KEY UPDATE `lastMigrationTime` = '").concat((0, iso_date_time_1.toISODate)(migration.date), "'\n                    "))];
                                    case 13:
                                        _d.sent();
                                        logger.log(runnedMigrationsAmount_1, "| Migration", migrationName, "successfully done");
                                        return [4 /*yield*/, utils_1.utils.sleep(100)];
                                    case 14:
                                        _d.sent();
                                        _d.label = 15;
                                    case 15:
                                        _i++;
                                        return [3 /*break*/, 5];
                                    case 16: return [2 /*return*/];
                                }
                            });
                        }); };
                        tablesToMigrate = Object.values(dataSource.options.entities || []).map(function (m) {
                            if (m instanceof typeorm_1.EntitySchema)
                                return m.options.name;
                            return undefined;
                        }).filter(Boolean);
                        _i = 0, tablesToMigrate_1 = tablesToMigrate;
                        _b.label = 6;
                    case 6:
                        if (!(_i < tablesToMigrate_1.length)) return [3 /*break*/, 9];
                        table = tablesToMigrate_1[_i];
                        return [4 /*yield*/, runTableMigration(table)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 6];
                    case 9:
                        if (runnedMigrationsAmount_1) {
                            logger.log("All migrations completed:", runnedMigrationsAmount_1);
                        }
                        return [4 /*yield*/, mysqlInstance_1.destroyConnection().catch(function (err) {
                                logger.error("Error while closing pool:", err);
                            })];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        err_1 = _b.sent();
                        if ((_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.sqlMessage) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("unknown database"))
                            return [2 /*return*/];
                        // logger.error("err of musql:", err.sqlMessage);
                        throw err_1;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    return MySQLMigrations;
}());
exports.MySQLMigrations = MySQLMigrations;
