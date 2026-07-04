"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroSQL = void 0;
var sql_1 = require("./sql");
var select_commands_1 = require("./sql/commands/select.commands");
var tables_commands_1 = require("./sql/commands/tables.commands");
var MicroSQL;
(function (MicroSQL) {
    function alter(table) {
        return new sql_1.SQLAlterCommand(table);
    }
    MicroSQL.alter = alter;
    function select(table) {
        return new select_commands_1.SQLSelectCommands(table);
    }
    MicroSQL.select = select;
    function tables() {
        return tables_commands_1.SQLTablesCommands;
    }
    MicroSQL.tables = tables;
})(MicroSQL = exports.MicroSQL || (exports.MicroSQL = {}));
