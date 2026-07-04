"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLSelectCommands = void 0;
var SQLSelectCommands = /** @class */ (function () {
    function SQLSelectCommands(table) {
        this.table = table;
    }
    SQLSelectCommands.prototype.all = function () {
        var _this = this;
        return {
            toMySQL: function () { return "SELECT * FROM `".concat(_this.table, "`;"); },
            toMSSQL: function () { return "SELECT * FROM [".concat(_this.table, "];"); },
        };
    };
    return SQLSelectCommands;
}());
exports.SQLSelectCommands = SQLSelectCommands;
