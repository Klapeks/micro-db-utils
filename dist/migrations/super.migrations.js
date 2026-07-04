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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperMigrations = void 0;
var typeorm_1 = require("typeorm");
var sql_1 = require("../sql");
var micro_sql_1 = require("../micro.sql");
var utils_1 = require("@klapeks/utils");
var tables_commands_1 = require("../sql/commands/tables.commands");
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
    SuperMigrations.runMigrations = function (dataSource) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var options, sqlInstance, _existsMigrationTable, migrationRecors, _b, runnedMigrationsAmount, runTableMigration, tablesToMigrate, _i, tablesToMigrate_1, table, err_1, err_2;
            var _this = this;
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
                        migrationRecors = _b.apply(void 0, [_c.sent(), 'table']);
                        logger.log('Migration records:', migrationRecors);
                        runnedMigrationsAmount = 0;
                        runTableMigration = function (table) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/];
                            });
                        }); };
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
                        return [4 /*yield*/, runTableMigration(table)];
                    case 9:
                        _c.sent();
                        _c.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 8];
                    case 11:
                        if (runnedMigrationsAmount) {
                            logger.log(utils_1.terminalColors.green + "All migrations completed:"
                                + utils_1.terminalColors.reset, runnedMigrationsAmount);
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
