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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawMySQLConnection = void 0;
var mysql2_1 = __importDefault(require("mysql2"));
var utils_1 = require("@klapeks/utils");
var logger = new utils_1.Logger('MySQL');
var RawMySQLConnection = /** @class */ (function () {
    function RawMySQLConnection(options) {
        this.poolOptions = {
            user: options.username,
            password: options.password,
            host: options.host,
            port: options.port,
            database: options.database,
            charset: options.charset,
        };
    }
    Object.defineProperty(RawMySQLConnection.prototype, "pool", {
        get: function () {
            return this._pool;
        },
        enumerable: false,
        configurable: true
    });
    RawMySQLConnection.prototype.takePool = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this._pool)
                    return [2 /*return*/, this._pool];
                // if (this.options.type != 'mysql') throw "Not a mysql";
                this._pool = mysql2_1.default.createPool(this.poolOptions);
                this._pool.on('connection', function () {
                    logger.log('Database connected');
                });
                this._pool.on('close', function () {
                    var _a;
                    logger.log('Database disconnected');
                    (_a = _this._pool) === null || _a === void 0 ? void 0 : _a.end();
                    _this._pool = undefined;
                });
                return [2 /*return*/, this._pool];
            });
        });
    };
    RawMySQLConnection.prototype.destroyConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (!_this._pool)
                            return resolve();
                        _this._pool.end(function (err) {
                            _this._pool = undefined;
                            if (err)
                                reject(err);
                            else
                                resolve();
                        });
                    })];
            });
        });
    };
    RawMySQLConnection.prototype.getConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this._pool) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.takePool()];
                    case 1:
                        _a._pool = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, new Promise(function (resolve, reject) {
                            if (!_this._pool)
                                return reject("Can't connect to (unknown) mysql");
                            _this._pool.getConnection(function (err, conn) {
                                if (err)
                                    return reject(err);
                                resolve(conn);
                            });
                        })];
                }
            });
        });
    };
    RawMySQLConnection.prototype.runSQL = function (query, params) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConnection()];
                    case 1:
                        connection = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                // logger.debug("SQL query: ", query, '| params:', params||[])
                                connection.query(query, params || [], function (err, result) {
                                    connection.release();
                                    if (err)
                                        return reject(err);
                                    resolve(result);
                                });
                            })];
                }
            });
        });
    };
    RawMySQLConnection.prototype.runSQL_One = function (query, params) {
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
    return RawMySQLConnection;
}());
exports.RawMySQLConnection = RawMySQLConnection;
