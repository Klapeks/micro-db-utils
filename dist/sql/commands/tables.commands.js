"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLTablesCommands = void 0;
var column_type_parser_1 = require("../column.type.parser");
var SQLTablesCommands = /** @class */ (function () {
    function SQLTablesCommands() {
    }
    SQLTablesCommands.tableInfo = function (database, table) {
        return {
            toMySQL: function () { return [
                "SELECT * FROM information_schema.tables",
                "WHERE table_schema = '".concat(database, "'"),
                "AND table_name = '".concat(table, "'"),
                "LIMIT 1;",
            ].join(' '); },
            toMSSQL: function () { return [
                "SELECT TOP 1 * FROM INFORMATION_SCHEMA.TABLES",
                "WHERE TABLE_CATALOG = '".concat(database, "'"),
                "AND TABLE_SCHEMA = 'dbo'",
                "AND TABLE_NAME = '".concat(table, "'"),
            ].join(' '); },
        };
    };
    SQLTablesCommands.createTable = function (options) {
        var _createQuery = function (dbtype) {
            var str = "CREATE TABLE ".concat(options.table, " (");
            var _index = 0;
            for (var _i = 0, _a = Object.entries(options.columns); _i < _a.length; _i++) {
                var _b = _a[_i], columnName = _b[0], columnType = _b[1];
                if (_index)
                    str += ', ';
                _index += 1;
                if (dbtype === 'mysql')
                    str += "`".concat(columnName, "` ");
                else if (dbtype === 'mssql')
                    str += "[".concat(columnName, "] ");
                else if (dbtype === 'postgres')
                    str += "\"".concat(columnName, "\" ");
                else
                    str += "".concat(columnName, " ");
                str += column_type_parser_1.MicroColumnTypeObject.toSQLQuery(dbtype, columnType, 'create-table');
            }
            str += ');';
            return str;
        };
        return {
            toMySQL: function () { return _createQuery('mysql'); },
            toMSSQL: function () { return _createQuery('mssql'); },
        };
    };
    return SQLTablesCommands;
}());
exports.SQLTablesCommands = SQLTablesCommands;
