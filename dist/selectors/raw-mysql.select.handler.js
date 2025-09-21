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
var MySQLSelectEntityHandler = /** @class */ (function (_super) {
    __extends(MySQLSelectEntityHandler, _super);
    function MySQLSelectEntityHandler(options) {
        return _super.call(this, options) || this;
    }
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
            var where, orderBy, limit, addOrderBy, i, whereCondition, result, totalCount;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = [];
                        orderBy = '';
                        limit = '';
                        // if (options.where) {
                        //     const W = options.where as any;
                        //     for (let key of Object.keys(W)) {
                        //         if (typeof W[key] == 'undefined' || W[key] === null) continue;
                        //         where.push([key, W[key]]);
                        //     }
                        // }
                        if (this.options.orderBy) {
                            orderBy = 'ORDER BY ';
                            addOrderBy = function (field, _index) {
                                if (_index === void 0) { _index = 0; }
                                var orderType = 'ASC';
                                if (Array.isArray(_this.options.orderType)) {
                                    orderType = _this.options.orderType[_index] || _this.options.orderType[0];
                                }
                                else {
                                    orderType = _this.options.orderType || 'ASC';
                                }
                                orderBy += field + ' ' + orderType.toUpperCase();
                            };
                            if (Array.isArray(this.options.orderBy)) {
                                for (i = 0; i < this.options.orderBy.length; i++) {
                                    if (i)
                                        orderBy += ', ';
                                    addOrderBy(this.options.orderBy[i], i);
                                }
                            }
                            else {
                                addOrderBy(this.options.orderBy, 0);
                            }
                        }
                        if (options.limit) {
                            limit = 'LIMIT ' + options.limit;
                            if (options.offset) {
                                limit += ' OFFSET ' + options.offset;
                            }
                        }
                        whereCondition = (where === null || where === void 0 ? void 0 : where.length) ? ('WHERE ' + where.map(function (w) { return w[0] + ' = ?'; }).join(' AND ')) : '';
                        return [4 /*yield*/, this.runSQL("\n            SELECT * FROM ".concat(this.getTableName(), "\n            ").concat(whereCondition, " ").concat(orderBy, " ").concat(limit, "\n        "), where.map(function (d) { return d[1]; }))];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, this.runSQL("\n            SELECT count(1) as 'count' \n            FROM ".concat(this.getTableName(), "\n            ").concat(whereCondition, "\n        "), where.map(function (d) { return d[1]; }))];
                    case 2:
                        totalCount = _b.sent();
                        if (!this.options.afterSelect) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.options.afterSelect(result, options)];
                    case 3:
                        result = _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/, { objects: result, total: ((_a = totalCount === null || totalCount === void 0 ? void 0 : totalCount[0]) === null || _a === void 0 ? void 0 : _a.count) || NaN }];
                }
            });
        });
    };
    return MySQLSelectEntityHandler;
}(abstract_select_handler_1.AbstractSelectHandler));
exports.MySQLSelectEntityHandler = MySQLSelectEntityHandler;
