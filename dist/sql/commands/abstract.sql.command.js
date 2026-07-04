"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawSQL = exports.AbstractSQLCommand = void 0;
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
