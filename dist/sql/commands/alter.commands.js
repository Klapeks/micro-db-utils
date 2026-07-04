"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLAlterCommand = void 0;
var column_type_parser_1 = require("../column.type.parser");
var SQLAlterCommand = /** @class */ (function () {
    function SQLAlterCommand(table) {
        this.table = table;
    }
    SQLAlterCommand.prototype.array = function (cb) {
        return cb(this);
    };
    SQLAlterCommand.prototype.renameColumn = function (old_name, new_name) {
        var _this = this;
        return {
            toMySQL: function () { return "ALTER TABLE `".concat(_this.table, "` RENAME COLUMN `").concat(old_name, "` TO `").concat(new_name, "`;"); },
            toMSSQL: function () { return "EXEC sp_rename '".concat(_this.table, ".").concat(old_name, "', '").concat(new_name, "', 'COLUMN';"); }
        };
    };
    SQLAlterCommand.prototype.changeColumnType = function (column, type) {
        var _this = this;
        return {
            toMySQL: function () { return "ALTER TABLE `".concat(_this.table, "` MODIFY COLUMN `").concat(column, "` ")
                + column_type_parser_1.MicroColumnTypeObject.toSQLQuery('mysql', type, 'alter-column') + ';'; },
            toMSSQL: function () { return "ALTER TABLE [".concat(_this.table, "] ALTER COLUMN [").concat(column, "] ")
                + column_type_parser_1.MicroColumnTypeObject.toSQLQuery('mssql', type, 'alter-column') + ';'; }
        };
    };
    SQLAlterCommand.prototype.addColumn = function (column, type) {
        var _this = this;
        return {
            toMySQL: function () { return "ALTER TABLE `".concat(_this.table, "` ADD COLUMN `").concat(column, "` ")
                + column_type_parser_1.MicroColumnTypeObject.toSQLQuery('mysql', type, 'alter-column') + ';'; },
            toMSSQL: function () { return "ALTER TABLE [".concat(_this.table, "] ADD [").concat(column, "] ")
                + column_type_parser_1.MicroColumnTypeObject.toSQLQuery('mssql', type, 'alter-column') + ';'; }
        };
    };
    return SQLAlterCommand;
}());
exports.SQLAlterCommand = SQLAlterCommand;
