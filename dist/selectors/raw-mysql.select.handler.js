"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLSelectEntityHandler = void 0;
var abstract_select_handler_1 = require("./abstract.select.handler");
var utils_1 = require("@klapeks/utils");
var parseWhereOnWhereBuilder = function (
// whereString: string,
multipleOrWheres, globalWhereArgs, type) {
    if (!multipleOrWheres)
        return '0';
    if (!Array.isArray(multipleOrWheres))
        throw "multipleOrWheres arg is not array";
    var whereString = '';
    // if (!queryBuilder.whereCondition) queryBuilder.whereCondition = '';
    // if (!queryBuilder.whereArgs) queryBuilder.whereArgs = [];
    // const multipleOrWheres = Array.isArray(options.where) ? options.where : [options.where];
    for (var i = 0; i < multipleOrWheres.length; i++) {
        var where = multipleOrWheres[i];
        // and inside (...and...)
        // let conditionPart = [] as string[];
        if (whereString) {
            if (type === 'or')
                whereString += ' OR ';
            if (type === 'and')
                whereString += ' AND ';
        }
        whereString += '(';
        for (var _i = 0, _a = Object.keys(where); _i < _a.length; _i++) {
            var key = _a[_i];
            if (typeof where[key] === 'undefined')
                continue;
            if (key === '$or') {
                if (!whereString.startsWith('('))
                    whereString += ' OR ';
                whereString += parseWhereOnWhereBuilder(where[key], globalWhereArgs, "or");
                continue;
            }
            if (!whereString.startsWith('('))
                whereString += ' AND ';
            if (key === '$and') {
                whereString += parseWhereOnWhereBuilder(where[key], globalWhereArgs, "and");
                continue;
            }
            if (where[key] === null) {
                whereString += key + ' IS NULL';
                continue;
            }
            if (where[key] === '{not}=null' || where[key] === '{not}=NULL') {
                whereString += key + ' IS NOT NULL';
                continue;
            }
            if (typeof where[key] === 'string') {
                if (where[key].startsWith('{like}=')) {
                    var strVal = where[key].substring(7).toLowerCase();
                    whereString += 'LOWER(' + key + ') LIKE ?';
                    // conditionPart.push('LOWER('  + key + ') LIKE ?');
                    globalWhereArgs.push(strVal);
                    continue;
                }
                if (where[key].startsWith('{not}=')) {
                    var strVal = where[key].substring(6).toLowerCase();
                    whereString += key + ' != ?';
                    globalWhereArgs.push(strVal);
                    continue;
                }
            }
            whereString += key + ' = ?';
            // conditionPart.push(key + ' = ?');
            globalWhereArgs.push(where[key]);
        }
        if (whereString.startsWith('(')) {
            whereString += '0';
        }
        whereString += ')';
    }
    return '(' + whereString + ')';
};
var MySQLSelectEntityHandler = /** @class */ (function (_super) {
    __extends(MySQLSelectEntityHandler, _super);
    function MySQLSelectEntityHandler(options) {
        return _super.call(this, options) || this;
    }
    MySQLSelectEntityHandler.prototype.getDatabaseType = function () {
        return 'mysql';
    };
    MySQLSelectEntityHandler.prototype.getTableName = function () {
        return this.options.schemaTableName;
    };
    MySQLSelectEntityHandler.prototype.runSQL = function (sql, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.options.mysql.runSQL(sql, params)];
            });
        });
    };
    MySQLSelectEntityHandler.prototype.getTotal = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.runSQL_One("\n            SELECT count(1) as 'count'\n            FROM ".concat(this.getTableName(), ";\n        "))];
                    case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.count];
                }
            });
        });
    };
    MySQLSelectEntityHandler.prototype.rawSelect = function (options) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var queryBuilder, addOrderBy, i, multipleWheres, limitQuery, result, totalCount;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        queryBuilder = {
                            select: "*",
                            leftJoin: "",
                            whereCondition: "",
                            whereArgs: [],
                            orderBy: "",
                        };
                        if (!this.options.beforeGetMany) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.options.beforeGetMany(queryBuilder, options)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        // orderBy
                        if (this.options.orderBy) {
                            addOrderBy = function (field, _index) {
                                if (_index === void 0) { _index = 0; }
                                var orderType = 'ASC';
                                if (Array.isArray(_this.options.orderType)) {
                                    orderType = _this.options.orderType[_index] || _this.options.orderType[0];
                                }
                                else {
                                    orderType = _this.options.orderType || 'ASC';
                                }
                                if (!queryBuilder.orderBy)
                                    queryBuilder.orderBy = '';
                                queryBuilder.orderBy += field + ' ' + orderType.toUpperCase();
                            };
                            if (Array.isArray(this.options.orderBy)) {
                                for (i = 0; i < this.options.orderBy.length; i++) {
                                    if (queryBuilder.orderBy)
                                        queryBuilder.orderBy += ', ';
                                    addOrderBy(this.options.orderBy[i], i);
                                }
                            }
                            else {
                                addOrderBy(this.options.orderBy, 0);
                            }
                        }
                        // where
                        if (options.where) {
                            multipleWheres = Array.isArray(options.where) ? options.where : [options.where];
                            if (queryBuilder.whereCondition) {
                                if (queryBuilder.whereCondition.toLowerCase().startsWith('where ')) {
                                    queryBuilder.whereCondition = queryBuilder.whereCondition.substring(6);
                                }
                                queryBuilder.whereCondition = '(' + queryBuilder.whereCondition + ')';
                            }
                            if (queryBuilder.whereCondition) {
                                queryBuilder.whereCondition += ' OR ';
                            }
                            if (!queryBuilder.whereArgs)
                                queryBuilder.whereArgs = [];
                            queryBuilder.whereCondition += parseWhereOnWhereBuilder(multipleWheres, queryBuilder.whereArgs, 'or');
                        }
                        // fixes
                        if (queryBuilder.whereCondition) {
                            if (!queryBuilder.whereCondition.toLowerCase().startsWith('where ')) {
                                queryBuilder.whereCondition = 'WHERE ' + queryBuilder.whereCondition;
                            }
                            if (this.options.mysql.isDebugLoggerEnabled || this.options.debugLogs) {
                                utils_1.logger.log('RawMysql Where Query:', queryBuilder.whereCondition, '\n|\t Args:', JSON.stringify(queryBuilder.whereArgs));
                            }
                        }
                        if (queryBuilder.leftJoin) {
                            if (!queryBuilder.leftJoin.toLowerCase().startsWith('left join ')) {
                                queryBuilder.leftJoin = 'LEFT JOIN ' + queryBuilder.leftJoin;
                            }
                        }
                        limitQuery = '';
                        if (options.limit) {
                            limitQuery = 'LIMIT ' + options.limit;
                            if (options.offset) {
                                limitQuery += ' OFFSET ' + options.offset;
                            }
                        }
                        return [4 /*yield*/, this.runSQL([
                                'SELECT ' + (queryBuilder.select || '*'),
                                'FROM ' + this.getTableName(),
                                queryBuilder.leftJoin,
                                queryBuilder.whereCondition,
                                queryBuilder.orderBy,
                                limitQuery
                            ].filter(Boolean).join('\n'), queryBuilder.whereArgs)];
                    case 3:
                        result = _b.sent();
                        return [4 /*yield*/, this.runSQL([
                                "SELECT count(1) as 'count'",
                                'FROM ' + this.getTableName(),
                                queryBuilder.leftJoinInCountToo
                                    ? queryBuilder.leftJoin : '',
                                queryBuilder.whereCondition,
                            ].filter(Boolean).join('\n'), queryBuilder.whereArgs)];
                    case 4:
                        totalCount = _b.sent();
                        if (!this.options.afterSelect) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.options.afterSelect(result, options)];
                    case 5:
                        result = _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/, { objects: result, total: ((_a = totalCount === null || totalCount === void 0 ? void 0 : totalCount[0]) === null || _a === void 0 ? void 0 : _a.count) || NaN }];
                }
            });
        });
    };
    return MySQLSelectEntityHandler;
}(abstract_select_handler_1.AbstractSelectHandler));
exports.MySQLSelectEntityHandler = MySQLSelectEntityHandler;
