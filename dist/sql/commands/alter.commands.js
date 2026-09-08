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
exports.SQLAlterCommand = void 0;
var utils_1 = require("@klapeks/utils");
var column_type_parser_1 = require("../column.type.parser");
var SQLAlterCommand = /** @class */ (function () {
    function SQLAlterCommand(table) {
        this.table = table;
    }
    SQLAlterCommand.prototype.array = function (cb) {
        return cb(this);
    };
    SQLAlterCommand.prototype.renameColumn = function (old_name, new_name) {
        var _this = this;
        return {
            toMySQL: function () { return "ALTER TABLE `".concat(_this.table, "` RENAME COLUMN `").concat(old_name, "` TO `").concat(new_name, "`;"); },
            toMSSQL: function () { return "EXEC sp_rename '".concat(_this.table, ".").concat(old_name, "', '").concat(new_name, "', 'COLUMN';"); },
            toSQLite: function () { return "ALTER TABLE \"".concat(_this.table, "\" RENAME COLUMN \"").concat(old_name, "\" TO \"").concat(new_name, "\";"); },
        };
    };
    SQLAlterCommand.prototype.addColumn = function (column, type) {
        var _this = this;
        return {
            toMySQL: function () { return "ALTER TABLE `".concat(_this.table, "` ADD COLUMN `").concat(column, "` ")
                + column_type_parser_1.MicroColumnTypeObject.toSQLQuery('mysql', type, 'alter-column') + ';'; },
            toMSSQL: function () { return "ALTER TABLE [".concat(_this.table, "] ADD [").concat(column, "] ")
                + column_type_parser_1.MicroColumnTypeObject.toSQLQuery('mssql', type, 'alter-column') + ';'; },
            toSQLite: function () { return "ALTER TABLE \"".concat(_this.table, "\" ADD COLUMN \"").concat(column, "\" ")
                + column_type_parser_1.MicroColumnTypeObject.toSQLQuery("sqlite", type, "alter-column") + ";"; }
        };
    };
    SQLAlterCommand.prototype.changeColumnType = function (column, type) {
        var _this = this;
        return {
            toMySQL: function () { return "ALTER TABLE `".concat(_this.table, "` MODIFY COLUMN `").concat(column, "` ")
                + column_type_parser_1.MicroColumnTypeObject.toSQLQuery('mysql', type, 'alter-column') + ';'; },
            toMSSQL: function () { return "ALTER TABLE [".concat(_this.table, "] ALTER COLUMN [").concat(column, "] ")
                + column_type_parser_1.MicroColumnTypeObject.toSQLQuery('mssql', type, 'alter-column') + ';'; },
            toSQLite: function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                var tableCreateOld, indexesToRecreate, tableCreateArray, _wasChanges, tableColumnNames, _loop_1, i, RECHANGE_TABLE_NAME;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!(ctx === null || ctx === void 0 ? void 0 : ctx.runAdditionalSQL))
                                throw "No runAdditionalSQL in context";
                            return [4 /*yield*/, ctx.runAdditionalSQL("\n                    SELECT sql FROM sqlite_master WHERE type = \"table\" AND name = \"".concat(this.table, "\";\n                "))];
                        case 1:
                            tableCreateOld = (_b = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.sql;
                            if (!tableCreateOld)
                                throw "Table ".concat(this.table, " not exists");
                            return [4 /*yield*/, ctx.runAdditionalSQL("\n                    SELECT sql FROM sqlite_master WHERE type = \"index\"\n                    AND tbl_name = \"".concat(this.table, "\" AND sql IS NOT NULL;\n                "))];
                        case 2:
                            indexesToRecreate = (_c.sent()).map(function (s) { return s.sql || s; }).filter(Boolean).join("; ") + ';';
                            tableCreateArray = tableCreateOld.split('\n');
                            _wasChanges = false;
                            tableColumnNames = [];
                            _loop_1 = function (i) {
                                if (tableCreateArray[i].trim()[0] == '"') {
                                    var str = tableCreateArray[i].trim().substring(1);
                                    tableColumnNames.push(str.substring(0, str.indexOf('"')));
                                }
                                if (!tableCreateArray[i].includes('"' + column + '"'))
                                    return "continue";
                                var arr = tableCreateArray[i].split('\t');
                                var indexName = arr.findIndex(function (a) { return a == '"' + column + '"'; });
                                if (indexName < 0)
                                    return "continue";
                                arr[indexName + 1] = (function () {
                                    var str = column_type_parser_1.MicroColumnTypeObject.toSQLQuery('sqlite', type);
                                    if (str.startsWith('text('))
                                        str = str.replace("text(", "varchar(");
                                    if (arr[indexName + 1].toLowerCase().includes(' unique'))
                                        str += ' UNIQUE';
                                    if (arr[indexName + 1].endsWith(','))
                                        str += ',';
                                    return str;
                                })();
                                // console.log("CHANGES ARR:", arr);
                                tableCreateArray[i] = arr.join('\t');
                                _wasChanges = true;
                            };
                            for (i = 0; i < tableCreateArray.length; i++) {
                                _loop_1(i);
                            }
                            if (!_wasChanges)
                                return [2 /*return*/, "SELECT 1"];
                            RECHANGE_TABLE_NAME = this.table + "___rechange_" + utils_1.utils.randomInclude(99);
                            tableCreateArray[0] = "CREATE TABLE \"".concat(RECHANGE_TABLE_NAME, "\" (");
                            // console.log("Table create:", tableCreateNew);
                            // console.log("INDEXES:", indexesToRecreate);
                            // console.log("Colums:", tableColumnNames);
                            // const hasColumnIndex = tableColumns.findIndex(
                            //     (row) => row.name === column
                            // );
                            // if (hasColumnIndex < 0) return "SELECT 1";
                            // // ctx?.runAdditionalSQL
                            // // throw "Not implemented yet: changeColumnType for sqlite"
                            return [2 /*return*/, "\n                    BEGIN;\n                    ".concat(tableCreateArray.join('\n'), ";\n                    INSERT INTO ").concat(RECHANGE_TABLE_NAME, " (").concat(tableColumnNames.join(', '), ") \n                        SELECT ").concat(tableColumnNames.join(', '), " FROM ").concat(this.table, ";\n                    DROP TABLE ").concat(this.table, ";\n                    ALTER TABLE ").concat(RECHANGE_TABLE_NAME, " RENAME TO ").concat(this.table, ";\n                    ").concat(indexesToRecreate, "\n                    COMMIT;\n                ")];
                    }
                });
            }); },
        };
    };
    return SQLAlterCommand;
}());
exports.SQLAlterCommand = SQLAlterCommand;
