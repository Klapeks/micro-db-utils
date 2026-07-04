"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroColumnTypeObject = exports.getRawDatabaseColumnTypeOfTypeORM = void 0;
var utils_1 = require("../utils");
// https://vscode.dev/github.com/typeorm/typeorm/blob/master/src/driver/mysql/MysqlDriver.ts#L750
// https://vscode.dev/github.com/typeorm/typeorm/blob/master/src/driver/sqlserver/SqlServerDriver.ts#L678
function getRawDatabaseColumnTypeOfTypeORM(dbtype, type) {
    if (type === Number) {
        if (dbtype == 'sqlite')
            return 'integer';
        if (dbtype == 'postgres')
            return 'integer';
        return 'int';
    }
    if (type === String) {
        if (dbtype === 'postgres')
            return 'character varying';
        if (dbtype === 'mssql')
            return 'nvarchar';
        return 'varchar';
    }
    if (type === Boolean) {
        if (dbtype === 'mssql')
            return 'bit';
        if (dbtype === 'mysql')
            return 'tinyint';
        return 'boolean';
    }
    if (type === Date)
        return utils_1.MULTISQL_COLUMNS_TYPES.datetime;
    return type;
}
exports.getRawDatabaseColumnTypeOfTypeORM = getRawDatabaseColumnTypeOfTypeORM;
var MicroColumnTypeObject;
(function (MicroColumnTypeObject) {
    function toSQLQuery(dbType, options, queryType) {
        var columnType = getRawDatabaseColumnTypeOfTypeORM(dbType, options.type);
        var columnLength = options.length || ((columnType === 'varchar'
            || columnType === 'nvarchar') ? 255 : undefined);
        var str = columnType + (columnLength ? "(".concat(columnLength, ")") : '');
        // nullable
        if (options.nullable)
            str += ' NULL';
        else
            str += ' NOT NULL';
        // auto increment
        if (options.generated) {
            if (dbType === 'mssql')
                str += ' IDENTITY';
            else if (dbType === 'mysql')
                str += ' AUTO_INCREMENT';
            else
                throw "options.generated is not supported yet for " + dbType;
        }
        // default
        if (options.default !== undefined) {
            var value = options.default;
            if (value === null || value === 'null' || value === 'NULL') {
                value = "NULL";
            }
            else if (typeof value === 'number') {
                value = value.toString(); // :)
            }
            else if (typeof value === 'boolean') {
                if (dbType === 'mssql') {
                    value = value ? '1' : '0';
                }
                else {
                    value = value ? "true" : "false";
                }
            }
            else if (typeof value === 'string') {
                value = "'".concat(value.replace(/'/g, "''"), "'");
            }
            else if (typeof value === 'object') {
                value = "'".concat(JSON.stringify(value), "'");
            }
            else {
                value = "'".concat(value, "'");
            }
            str += " DEFAULT ".concat(value);
        }
        // primary key
        if (queryType === 'create-table') {
            if (options.primary) {
                str += ' PRIMARY KEY';
            }
        }
        return str;
    }
    MicroColumnTypeObject.toSQLQuery = toSQLQuery;
})(MicroColumnTypeObject = exports.MicroColumnTypeObject || (exports.MicroColumnTypeObject = {}));
