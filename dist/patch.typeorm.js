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
exports.patchTypeorm = void 0;
var typeorm_1 = require("typeorm");
var _alreadyPatched = false;
function patchTypeorm() {
    if (_alreadyPatched)
        return;
    { // repository changes
        var originalUpdate_1 = typeorm_1.Repository.prototype.update;
        typeorm_1.Repository.prototype.update = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _wasDel = false;
            for (var _a = 0, _b = Object.keys(args[0]); _a < _b.length; _a++) {
                var key = _b[_a];
                if (typeof args[1] === 'object' && key in args[1]) {
                    if (args[0][key] === args[1][key]) {
                        if (!_wasDel) {
                            args[1] = __assign({}, args[1]);
                            _wasDel = true;
                        }
                        delete args[1][key];
                    }
                }
            }
            return originalUpdate_1.apply(this, args);
        };
        var originalUpsert_1 = typeorm_1.Repository.prototype.upsert;
        typeorm_1.Repository.prototype.upsert = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.manager.connection.options.type === "mssql") {
                        return [2 /*return*/, this.save(args[0])];
                    }
                    return [2 /*return*/, originalUpsert_1.apply(this, args)];
                });
            });
        };
    }
    { // query builder changes changes
        var whereFix_1 = function (dbtype, args) {
            if (args[0] && typeof args[0] === 'string') {
                if (dbtype == 'mssql') {
                    args[0] = args[0].replace(/\btrue\b/g, "1");
                    args[0] = args[0].replace(/\bfalse\b/g, "0");
                }
            }
            return args;
        };
        var originalWhere_1 = typeorm_1.SelectQueryBuilder.prototype.where;
        typeorm_1.SelectQueryBuilder.prototype.where = function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var dbType = this.connection.options.type
                || ((_a = this.dataSource) === null || _a === void 0 ? void 0 : _a.options.type);
            return originalWhere_1.apply(this, whereFix_1(dbType, args));
        };
        var originalAndWhere_1 = typeorm_1.SelectQueryBuilder.prototype.andWhere;
        typeorm_1.SelectQueryBuilder.prototype.andWhere = function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var dbType = this.connection.options.type
                || ((_a = this.dataSource) === null || _a === void 0 ? void 0 : _a.options.type);
            return originalAndWhere_1.apply(this, whereFix_1(dbType, args));
        };
    }
    _alreadyPatched = true;
}
exports.patchTypeorm = patchTypeorm;
