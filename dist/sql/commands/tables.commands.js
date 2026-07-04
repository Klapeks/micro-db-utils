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
    SQLTablesCommands.getTablesSizes = function (database) {
        return {
            toMySQL: function () { return "\n                SELECT \n                    TABLE_NAME as 'table_name', \n                    (DATA_LENGTH / 1024) as 'data_kb', \n                    (INDEX_LENGTH / 1024) as 'index_kb'\n                FROM information_schema.TABLES\n                WHERE table_schema = '".concat(database, "'\n                ORDER BY (data_kb + index_kb) DESC;\n            "); },
            toMSSQL: function () { return "\n                SELECT * FROM (\n                    SELECT\n                        t.name AS table_name,\n                        SUM(ps.in_row_data_page_count + ps.lob_used_page_count\n                            + ps.row_overflow_used_page_count\n                            ) * 8 AS data_kb,\n                        SUM(ps.used_page_count - ps.in_row_data_page_count\n                            - ps.lob_used_page_count - ps.row_overflow_used_page_count\n                            ) * 8 AS index_kb\n                    FROM sys.tables t\n                    JOIN sys.dm_db_partition_stats ps\n                        ON t.object_id = ps.object_id\n                    GROUP BY t.name\n                ) t ORDER BY (data_kb + index_kb) DESC;\n            "; },
            // postgress
            // SELECT
            //     relname AS table_name,
            //     pg_relation_size(relid) / 1024 AS data_kb,
            //     pg_indexes_size(relid) / 1024 AS index_kb
            // FROM pg_catalog.pg_statio_user_tables
            // ORDER BY pg_total_relation_size(relid) DESC;
            // sqlite
            // 1. SELECT
            //     name AS table_name
            // FROM sqlite_master
            // WHERE type = 'table';
            // 2. SELECT
            //     SUM(pgsize) / 1024.0 AS data_kb
            // FROM dbstat
            // WHERE name = ?;
        };
    };
    return SQLTablesCommands;
}());
exports.SQLTablesCommands = SQLTablesCommands;
