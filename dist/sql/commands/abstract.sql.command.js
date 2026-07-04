"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRawSQL = exports.rawSQL = exports.AbstractSQLCommand = void 0;
var AbstractSQLCommand = /** @class */ (function () {
    function AbstractSQLCommand() {
    }
    return AbstractSQLCommand;
}());
exports.AbstractSQLCommand = AbstractSQLCommand;
var rawSQL = function (sqls) {
    return {
        toMySQL: function () { return sqls.mysqlQuery || sqls.defaultQuery; },
        toMSSQL: function () { return sqls.mssqlQuery || sqls.defaultQuery; },
    };
};
exports.rawSQL = rawSQL;
function toRawSQL(dbType, query) {
    if (typeof query === 'string')
        return { query: query };
    if (typeof query === 'object' && !('query' in query)) {
        if (dbType === 'mysql')
            query = query.toMySQL({});
        else if (dbType === 'mssql')
            query = query.toMSSQL({});
        else
            throw "Unknown database type: " + dbType;
    }
    return typeof query === 'string' ? { query: query } : query;
}
exports.toRawSQL = toRawSQL;
