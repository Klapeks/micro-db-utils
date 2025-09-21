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
        while (_) try {
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
exports.SelectEntityHandler = void 0;
var typeorm_1 = require("typeorm");
var abstract_select_handler_1 = require("./abstract.select.handler");
var SelectEntityHandler = /** @class */ (function (_super) {
    __extends(SelectEntityHandler, _super);
    function SelectEntityHandler(options) {
        return _super.call(this, options) || this;
    }
    Object.defineProperty(SelectEntityHandler.prototype, "dataSource", {
        get: function () { return this.options.dataSource; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SelectEntityHandler.prototype, "schema", {
        get: function () { return this.options.schema; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SelectEntityHandler.prototype, "repo", {
        get: function () { return this.dataSource.getRepository(this.schema); },
        enumerable: false,
        configurable: true
    });
    SelectEntityHandler.prototype.getTableName = function () {
        return this.schema.options.name;
    };
    SelectEntityHandler.prototype.runSQL = function (sql, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataSource.query(sql, params)];
            });
        });
    };
    SelectEntityHandler.prototype.getTotal = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.repo.count()];
            });
        });
    };
    SelectEntityHandler.prototype.rawSelect = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var builder, addOrderBy, i, multipleWheres_1, result;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        builder = this.repo.createQueryBuilder(this.schema.options.name);
                        builder.select(this.schema.options.name + '.*');
                        // if (this.options.preBuilder) this.options.preBuilder(builder);
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
                                if (_index)
                                    builder.addOrderBy(field, orderType.toUpperCase());
                                else
                                    builder.orderBy(field, orderType.toUpperCase());
                            };
                            if (Array.isArray(this.options.orderBy)) {
                                for (i = 0; i < this.options.orderBy.length; i++) {
                                    addOrderBy(this.options.orderBy[i], i);
                                }
                            }
                            else {
                                addOrderBy(this.options.orderBy, 0);
                            }
                        }
                        if (options.where) {
                            multipleWheres_1 = Array.isArray(options.where) ? options.where : [options.where];
                            builder.andWhere(new typeorm_1.Brackets(function (qb1) {
                                var _loop_1 = function (i) {
                                    var where = multipleWheres_1[i];
                                    qb1 = qb1.orWhere(new typeorm_1.Brackets(function (qb2) {
                                        var _a, _b;
                                        for (var _i = 0, _c = Object.keys(where); _i < _c.length; _i++) {
                                            var key = _c[_i];
                                            var placeholderKey = key + "_" + i;
                                            if (typeof where[key] == undefined)
                                                continue;
                                            if (where[key] == null) {
                                                qb2 = qb2.andWhere('key is NULL');
                                                continue;
                                            }
                                            if (typeof where[key] == 'string' && where[key].startsWith('{like}=')) {
                                                var strVal = where[key].substring(7).toLowerCase();
                                                qb2 = qb2.andWhere('lower(' + key + ') like :' + placeholderKey, (_a = {}, _a[placeholderKey] = strVal, _a));
                                                continue;
                                            }
                                            qb2 = qb2.andWhere(key + ' = :' + placeholderKey, (_b = {}, _b[placeholderKey] = where[key], _b));
                                        }
                                    }));
                                };
                                // qb1 = qb1.where('0 = 1');
                                for (var i = 0; i < multipleWheres_1.length; i++) {
                                    _loop_1(i);
                                }
                            }));
                        }
                        if (!this.options.beforeGetMany) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.options.beforeGetMany(builder, options)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        builder.limit(options.limit);
                        if (options.offset)
                            builder.offset(options.offset);
                        return [4 /*yield*/, builder.getRawMany()];
                    case 3:
                        result = _b.sent();
                        if (!this.options.afterSelect) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.options.afterSelect(result, options)];
                    case 4:
                        result = _b.sent();
                        _b.label = 5;
                    case 5:
                        _a = { objects: result };
                        return [4 /*yield*/, builder.getCount()];
                    case 6: return [2 /*return*/, (_a.total = _b.sent(), _a)];
                }
            });
        });
    };
    return SelectEntityHandler;
}(abstract_select_handler_1.AbstractSelectHandler));
exports.SelectEntityHandler = SelectEntityHandler;
