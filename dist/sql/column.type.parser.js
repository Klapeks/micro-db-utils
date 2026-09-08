"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroColumnTypeObject = exports.getRawDatabaseColumnTypeOfTypeORM = void 0;
var utils_1 = require("@klapeks/utils");
Object.defineProperty(exports, "getRawDatabaseColumnTypeOfTypeORM", { enumerable: true, get: function () { return utils_1.getRawDatabaseColumnTypeOfTypeORM; } });
var MicroColumnTypeObject;
(function (MicroColumnTypeObject) {
    function toSQLQuery(dbType, options, queryType) {
        var columnType = (0, utils_1.getRawDatabaseColumnTypeOfTypeORM)(dbType, options.type);
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
            else if (dbType === 'sqlite') { /** after primary key */ }
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
            if (dbType === 'sqlite' && options.generated) {
                str += ' AUTOINCREMENT';
            }
        }
        return str;
    }
    MicroColumnTypeObject.toSQLQuery = toSQLQuery;
})(MicroColumnTypeObject = exports.MicroColumnTypeObject || (exports.MicroColumnTypeObject = {}));
