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
exports.SQLiteConnection = void 0;
var utils_1 = require("@klapeks/utils");
var abstract_connection_1 = require("./abstract.connection");
var quiet_require_1 = require("../../utils/quiet.require");
var sqlite3 = (0, quiet_require_1.quietRequire)('sqlite3');
var logger = new utils_1.Logger('SQLite');
var SQLiteConnection = /** @class */ (function (_super) {
    __extends(SQLiteConnection, _super);
    function SQLiteConnection(options) {
        return _super.call(this, options, 'toSQLite') || this;
    }
    SQLiteConnection.prototype.initConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConnection()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SQLiteConnection.prototype.getConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!sqlite3)
                    throw "sqlite3 module is not installed";
                if (this._db)
                    return [2 /*return*/, this._db];
                this._db = new sqlite3.Database(this.rawOptions.database);
                this._db.exec("\n            PRAGMA journal_mode = WAL;\n            PRAGMA busy_timeout = 15000;\n        ");
                return [2 /*return*/, this._db];
            });
        });
    };
    SQLiteConnection.prototype.destroyConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (!_this._db)
                            return resolve();
                        try {
                            _this._db.close(function (err) {
                                logger.log('Database disconnected');
                                if (err)
                                    reject(err);
                                else
                                    resolve();
                            });
                        }
                        catch (err) {
                            reject(err);
                        }
                        finally {
                            _this._db = undefined;
                        }
                    })];
            });
        });
    };
    SQLiteConnection.prototype.sendSQL = function (query, params) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConnection()];
                    case 1:
                        connection = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                _this.debugQuery(query, params);
                                var upperSQL = query.trim().toUpperCase();
                                if (upperSQL.startsWith('BEGIN')
                                    || upperSQL.startsWith('COMMIT')
                                    || upperSQL.startsWith('ROLLBACK')) {
                                    return connection.exec(query, function (err) {
                                        if (err)
                                            return reject(err);
                                        resolve([]);
                                    });
                                }
                                if (!params)
                                    params = [];
                                if (upperSQL.startsWith('SELECT') || upperSQL.startsWith("PRAGMA")) {
                                    return connection.all(query, params, function (err1, rows) {
                                        if (err1)
                                            return reject(err1);
                                        resolve((rows || []));
                                    });
                                }
                                return connection.run(query, params, function (err1) {
                                    if (err1)
                                        return reject(err1);
                                    resolve(this);
                                });
                            })];
                }
            });
        });
    };
    return SQLiteConnection;
}(abstract_connection_1.AbstractSQLConnection));
exports.SQLiteConnection = SQLiteConnection;
