"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLEditDataCommands = void 0;
var raw_where_utils_1 = require("../raw.where.utils");
var SQLEditDataCommands = /** @class */ (function () {
    function SQLEditDataCommands(table) {
        this.table = table;
    }
    SQLEditDataCommands.prototype.update = function (data, where) {
        var _this = this;
        return {
            toMySQL: function () { return ({
                query: "\n                    UPDATE `".concat(_this.table, "`\n                    SET ").concat(Object.keys(data).map(function (key) { return "`".concat(key, "` = ?"); }).join(','), "\n                    WHERE ").concat(Object.keys(where).map(function (key) { return (0, raw_where_utils_1.converWhereQuery)('mysql', key, data[key], '?'); }).join(' AND '), ";\n                "),
                params: __spreadArray(__spreadArray([], Object.values(data), true), Object.values(where), true)
            }); },
            toMSSQL: function () { return ({
                query: "\n                    UPDATE [".concat(_this.table, "] \n                    SET ").concat(Object.keys(data).map(function (key) { return "[".concat(key, "] = @").concat(key); }).join(','), "\n                    WHERE ").concat(Object.keys(where).map(function (key) { return (0, raw_where_utils_1.converWhereQuery)('mssql', key, data[key], 'where_' + key); }).join(' AND '), ";\n                "),
                params: (function () {
                    var params = __assign({}, data);
                    for (var _i = 0, _a = Object.keys(where); _i < _a.length; _i++) {
                        var key = _a[_i];
                        params['where_' + key] = where[key];
                    }
                    return params;
                })()
            }); },
        };
    };
    SQLEditDataCommands.prototype.upsert = function (data, idKeys) {
        var _this = this;
        if (!data)
            throw "No data param";
        if (!(idKeys === null || idKeys === void 0 ? void 0 : idKeys.length))
            throw "No idKeys param";
        if (Object.keys(data).length <= idKeys.length) {
            throw "Nothing to update";
        }
        var dataKeys = Object.keys(data);
        var toUpdObj = {};
        for (var _i = 0, dataKeys_1 = dataKeys; _i < dataKeys_1.length; _i++) {
            var key = dataKeys_1[_i];
            if (idKeys.includes(key))
                continue;
            toUpdObj[key] = data[key];
        }
        return {
            toMySQL: function () { return ({
                query: "\n                    INSERT INTO `".concat(_this.table, "` \n                    (").concat(dataKeys.map(function (a) { return "`".concat(a, "`"); }).join(', '), ")\n                    VALUES (").concat(dataKeys.map(function () { return '?'; }).join(', '), ")\n                    ON DUPLICATE KEY UPDATE ").concat(Object.keys(toUpdObj)
                    .map(function (key) { return "`".concat(key, "` = ?"); }).join(', '), ";\n                "),
                params: __spreadArray(__spreadArray([], Object.values(data), true), Object.values(toUpdObj), true)
            }); },
            toMSSQL: function () { return ({
                query: "\n                    UPDATE [".concat(_this.table, "] \n                    SET ").concat(Object.keys(toUpdObj).map(function (key) { return "[".concat(key, "] = @").concat(key); }).join(','), "\n                    WHERE ").concat(idKeys.map(function (key) { return (0, raw_where_utils_1.converWhereQuery)('mssql', key, data[key], key); }).join(' AND '), ";\n\n                    IF @@ROWCOUNT = 0 INSERT INTO [").concat(_this.table, "]\n                        (").concat(dataKeys.map(function (a) { return "[".concat(a, "]"); }).join(', '), ")\n                        VALUES (").concat(dataKeys.map(function (key) { return '@' + key; }).join(', '), ");\n                "),
                params: data
            }); },
        };
    };
    return SQLEditDataCommands;
}());
exports.SQLEditDataCommands = SQLEditDataCommands;
