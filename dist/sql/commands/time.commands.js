"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLTimeCommandsExpressions = void 0;
var iso_date_time_1 = require("../../utils/iso.date.time");
var SQLTimeCommandsExpressions = /** @class */ (function () {
    function SQLTimeCommandsExpressions(dbtype) {
        this.dbtype = dbtype;
    }
    SQLTimeCommandsExpressions.prototype.time = function (expr) {
        if (this.dbtype === 'mssql'
            || this.dbtype == 'postgres') {
            return "CAST(".concat(expr, " AS TIME(0))");
        }
        return "time(".concat(expr, ")");
    };
    SQLTimeCommandsExpressions.prototype.date = function (expr) {
        if (this.dbtype === 'mssql'
            || this.dbtype == 'postgres') {
            return "CAST(".concat(expr, " AS DATE)");
        }
        return "date(".concat(expr, ")");
    };
    SQLTimeCommandsExpressions.prototype.dateFromToWhere = function (dateAlias, from, to) {
        var sql = this.date(dateAlias) + " >= " + "'" + (0, iso_date_time_1.toISODate)(from, "yyyy-mm-dd") + "'";
        if (to)
            sql += this.date(dateAlias) + " <= " + "'" + (0, iso_date_time_1.toISODate)(to, "yyyy-mm-dd") + "'";
        return sql;
    };
    return SQLTimeCommandsExpressions;
}());
exports.SQLTimeCommandsExpressions = SQLTimeCommandsExpressions;
