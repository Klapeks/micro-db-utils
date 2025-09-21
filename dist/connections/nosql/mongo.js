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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoGeoPoint = exports.MongoDBConnection = exports.cursorOffsetAggregation = exports.flattenForUpdate = void 0;
var utils_1 = require("@klapeks/utils");
var mongoose_1 = __importDefault(require("mongoose"));
function flattenForUpdate(object, prefix) {
    if (prefix === void 0) { prefix = ''; }
    var _o = object;
    var result = {};
    for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
        var key = _a[_i];
        if (typeof key != 'string' && typeof key != 'number')
            continue;
        if (_o[key] === undefined)
            continue;
        if (_o[key] === null || Array.isArray(_o[key]) || (_o[key] instanceof Date)) {
            result[prefix + key] = _o[key];
            continue;
        }
        if (typeof _o[key] == 'object') {
            var nested = flattenForUpdate(_o[key], prefix + key + '.');
            Object.assign(result, nested);
            continue;
        }
        result[prefix + key] = _o[key];
    }
    return result;
}
exports.flattenForUpdate = flattenForUpdate;
function cursorOffsetAggregation(sortField, lastValue, fieldSort, idField, lastId) {
    var _a, _b, _c;
    return {
        $match: {
            $or: [(_a = {},
                    _a[sortField] = (_b = {}, _b[fieldSort == 'asc' ? '$gt' : '$lt'] = lastValue, _b),
                    _a), (_c = {},
                    _c[sortField] = lastValue,
                    _c[idField] = { $gt: lastId },
                    _c)]
        }
    };
}
exports.cursorOffsetAggregation = cursorOffsetAggregation;
var _databaseName = '';
var MongoDBConnection = /** @class */ (function () {
    function MongoDBConnection() {
    }
    MongoDBConnection.createCounter = function (name) {
        var _this = this;
        if (name === void 0) { name = 'Counter'; }
        var _CounterSchema = new mongoose_1.default.Schema({
            // @ts-ignore // idk why, but compiler is angry
            model: { type: String, required: true, unique: true },
            counter: { type: Number, default: 0 }
        }, {
            versionKey: false
        });
        var CounterModel = mongoose_1.default.model(name, _CounterSchema);
        return {
            model: CounterModel,
            increment: function (model, increment) {
                if (increment === void 0) { increment = 1; }
                return __awaiter(_this, void 0, void 0, function () {
                    var counter;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, CounterModel.findOneAndUpdate({ model: model }, { $inc: { counter: increment } }, // безопасно при параллелизме
                                { new: true, upsert: true } // создаёт запись при первом вызове
                                )];
                            case 1:
                                counter = _a.sent();
                                return [2 /*return*/, counter.counter];
                        }
                    });
                });
            },
            set: function (model, value) { return __awaiter(_this, void 0, void 0, function () {
                var counter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, CounterModel.findOneAndUpdate({ model: model }, { $set: { counter: value } }, // безопасно при параллелизме
                            { new: true, upsert: true } // создаёт запись при первом вызове
                            )];
                        case 1:
                            counter = _a.sent();
                            return [2 /*return*/, counter.counter];
                    }
                });
            }); }
        };
    };
    MongoDBConnection.getOptions = function () {
        return {
            // type: "mongo",
            type: "mongo",
            host: process.env.MONGO_DATABASE_HOST || '127.0.0.1',
            port: Number(process.env.MONGO_DATABASE_PORT || '27017'),
            username: process.env.MONGO_DATABASE_LOGIN || '',
            password: process.env.MONGO_DATABASE_PASSWORD || '',
            logging: true,
            database: ""
        };
    };
    MongoDBConnection.init = function (databaseName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, host, port, password, username, mongoURI;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (_databaseName)
                            return [2 /*return*/];
                        _a = this.getOptions(), host = _a.host, port = _a.port, password = _a.password, username = _a.username;
                        mongoURI = 'mongodb://' + host + ':' + port + '/' + databaseName;
                        // logger.log(mongoURI);
                        return [4 /*yield*/, mongoose_1.default.connect(mongoURI, {
                                auth: username ? {
                                    username: username,
                                    password: password,
                                } : undefined,
                                authSource: "admin"
                            })];
                    case 1:
                        // logger.log(mongoURI);
                        _b.sent();
                        _databaseName = databaseName;
                        utils_1.logger.log("Mongo connected to database:", databaseName);
                        return [2 /*return*/];
                }
            });
        });
    };
    return MongoDBConnection;
}());
exports.MongoDBConnection = MongoDBConnection;
exports.MongoGeoPoint = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        required: true
    }
}, { _id: false });
