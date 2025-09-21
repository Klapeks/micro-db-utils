"use strict";
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
exports.AbstractSelectHandler = void 0;
var iso_date_time_1 = require("../utils/iso.date.time");
var AbstractSelectHandler = /** @class */ (function () {
    function AbstractSelectHandler(options) {
        this.options = options;
        if (!this.options.maxLimit)
            this.options.maxLimit = 100;
    }
    AbstractSelectHandler.prototype.runSQL_One = function (query, params) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.runSQL(query, params)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.length ? (res[0] || res) : null];
                }
            });
        });
    };
    AbstractSelectHandler.prototype.select = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.rawSelect(options)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, (_a = {
                                    size: result.objects.length,
                                    total: result.total
                                },
                                _a[this.options.name] = result.objects,
                                _a)];
                }
            });
        });
    };
    AbstractSelectHandler.prototype.sqlCount = function (field) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.runSQL_One("\n            SELECT count(".concat(field, ") as 'count'\n            FROM ").concat(this.getTableName(), ";\n        "))];
                    case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.count];
                }
            });
        });
    };
    AbstractSelectHandler.prototype.getSumStatistic = function (sumField, strWhere) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var stat, time, response, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            var _p;
            var _this = this;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        stat = function (fromDate, time) { return __awaiter(_this, void 0, void 0, function () {
                            var isoDate, sum;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (typeof fromDate == 'function') {
                                            fromDate = (0, iso_date_time_1.dateFromNow)(fromDate);
                                        }
                                        isoDate = (0, iso_date_time_1.toISODate)(fromDate, 'yyyy-mm-dd');
                                        return [4 /*yield*/, this.runSQL_One("\n                SELECT SUM(".concat(sumField, ") as sum\n                FROM ").concat(this.getTableName(), "\n                WHERE ").concat(time ? "createdAt >= '".concat(isoDate, " ").concat(time, "'")
                                                : "date(createdAt) >= date('".concat(isoDate, "')"), "\n                ").concat(strWhere ? ('AND (' + strWhere + ')') : '', "\n            "))];
                                    case 1:
                                        sum = ((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.sum) || 0;
                                        return [2 /*return*/, {
                                                from: isoDate + ' ' + (time || '00:00:00'),
                                                sum: sum,
                                            }];
                                }
                            });
                        }); };
                        time = new Date().toLocaleTimeString('uk-UA');
                        _p = {
                            serverTime: time
                        };
                        return [4 /*yield*/, this.getTotal()];
                    case 1:
                        response = (_p.count = _q.sent(),
                            _p);
                        _b = response;
                        return [4 /*yield*/, this.runSQL_One("\n            SELECT SUM(".concat(sumField, ") as sum\n            FROM ").concat(this.getTableName(), "\n            ").concat(strWhere ? ("WHERE " + strWhere) : '', "\n        "))];
                    case 2:
                        _b.total = (_a = (_q.sent())) === null || _a === void 0 ? void 0 : _a.sum;
                        _c = response;
                        return [4 /*yield*/, stat(new Date())];
                    case 3:
                        _c.thisDay = _q.sent();
                        _d = response;
                        return [4 /*yield*/, stat(function (d) { return d.setDate(d.getDate() - (d.getDay() || 7) + 1); })];
                    case 4:
                        _d.thisWeek = _q.sent();
                        _e = response;
                        return [4 /*yield*/, stat(function (d) { return d.setDate(1); })];
                    case 5:
                        _e.thisMonth = _q.sent();
                        _f = response;
                        return [4 /*yield*/, stat(function (d) { d.setMonth(0); d.setDate(1); })];
                    case 6:
                        _f.thisYear = _q.sent();
                        _g = response;
                        return [4 /*yield*/, stat(function (d) { return d.setDate(d.getDate() - 1); }, time)];
                    case 7:
                        _g.past24hours = _q.sent();
                        _h = response;
                        return [4 /*yield*/, stat(function (d) { return d.setDate(d.getDate() - 2); })];
                    case 8:
                        _h.past3days = _q.sent();
                        _j = response;
                        return [4 /*yield*/, stat(function (d) { return d.setDate(d.getDate() - 6); })];
                    case 9:
                        _j.past7days = _q.sent();
                        _k = response;
                        return [4 /*yield*/, stat(function (d) { return d.setDate(d.getDate() - 13); })];
                    case 10:
                        _k.past14days = _q.sent();
                        _l = response;
                        return [4 /*yield*/, stat(function (d) { return d.setDate(d.getDate() - 29); })];
                    case 11:
                        _l.past30days = _q.sent();
                        _m = response;
                        return [4 /*yield*/, stat(function (d) { return d.setMonth(d.getMonth() - 6); })];
                    case 12:
                        _m.past6months = _q.sent();
                        _o = response;
                        return [4 /*yield*/, stat(function (d) { return d.setMonth(d.getMonth() - 12); })];
                    case 13:
                        _o.past12months = _q.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    AbstractSelectHandler.prototype.handleQuery = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                options = {
                    limit: Number(req.query.limit),
                    offset: Number(req.query.offset)
                };
                if (!options.limit || options.limit < 0)
                    throw "Invalid limit field";
                if (options.limit > (this.options.maxLimit || 100))
                    throw "Too much limit";
                if (typeof req.query.where == 'object') {
                    options.where = req.query.where;
                }
                return [2 /*return*/, options];
            });
        });
    };
    return AbstractSelectHandler;
}());
exports.AbstractSelectHandler = AbstractSelectHandler;
