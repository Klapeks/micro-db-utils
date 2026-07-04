"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroSQL = void 0;
var sql_1 = require("./sql");
var MicroSQL;
(function (MicroSQL) {
    function alter(table) {
        return new sql_1.SQLAlterCommand(table);
    }
    MicroSQL.alter = alter;
    function select(table) {
        return new sql_1.SQLSelectCommands(table);
    }
    MicroSQL.select = select;
    function tables() {
        return sql_1.SQLTablesCommands;
    }
    MicroSQL.tables = tables;
    function timeExpressions(dbtype) {
        return new sql_1.SQLTimeCommandsExpressions(dbtype);
    }
    MicroSQL.timeExpressions = timeExpressions;
})(MicroSQL = exports.MicroSQL || (exports.MicroSQL = {}));
