"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLTimeCommandsExpressions = void 0;
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
        return "time(".concat(expr, ")");
    };
    return SQLTimeCommandsExpressions;
}());
exports.SQLTimeCommandsExpressions = SQLTimeCommandsExpressions;
