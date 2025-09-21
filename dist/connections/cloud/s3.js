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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Connection = void 0;
var client_s3_1 = require("@aws-sdk/client-s3");
var s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
var utils_1 = require("@klapeks/utils");
var logger = new utils_1.Logger("S3/R2");
var fixPath = function (path) {
    while (path[0] == '/')
        path = path.substring(1);
    if (path.includes('?'))
        path = path.split('?')[0];
    return path;
};
var S3Connection = /** @class */ (function () {
    function S3Connection(config) {
        this._config = config;
        this.client = new client_s3_1.S3Client({
            region: "auto",
            endpoint: config.url,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey
            },
        });
        logger.log("S3 connection created:", config.bucket);
    }
    Object.defineProperty(S3Connection.prototype, "bucketName", {
        get: function () {
            return this._config.bucket;
        },
        enumerable: false,
        configurable: true
    });
    S3Connection.prototype.presignedUploadObjectUrl = function (path, mimeType) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, s3_request_presigner_1.getSignedUrl)(this.client, new client_s3_1.PutObjectCommand({
                            Bucket: this.bucketName,
                            Key: fixPath(path),
                            ContentType: mimeType,
                        }), { expiresIn: 3600 })];
                    case 1:
                        url = _a.sent();
                        return [2 /*return*/, { url: url, mimeType: mimeType }];
                }
            });
        });
    };
    S3Connection.prototype.uploadObject = function (path, buffer, mimeType) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.send(new client_s3_1.PutObjectCommand({
                            Bucket: this.bucketName,
                            Key: fixPath(path),
                            Body: buffer,
                            ContentType: mimeType,
                        }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    S3Connection.prototype.listByPrefix = function (prefix) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        while (prefix[0] == '/')
                            prefix = prefix.substring(1);
                        return [4 /*yield*/, this.client.send(new client_s3_1.ListObjectsCommand({
                                Bucket: this.bucketName, Prefix: prefix
                            }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    S3Connection.prototype.deleteFiles = function (keys) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!keys.length)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.client.send(new client_s3_1.DeleteObjectsCommand({
                                Bucket: this.bucketName,
                                Delete: {
                                    Objects: keys.map(function (k) { return ({ Key: fixPath(k) }); })
                                }
                            }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    S3Connection.prototype.removeDirectory = function (directory) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var listedObjects, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        while (directory[0] == '/')
                            directory = directory.substring(1);
                        return [4 /*yield*/, this.listByPrefix(directory)];
                    case 1:
                        listedObjects = _c.sent();
                        listedObjects.Contents = (_a = listedObjects.Contents) === null || _a === void 0 ? void 0 : _a.filter(function (k) { return k.Key; });
                        logger.log("content:", listedObjects.Contents);
                        if (!((_b = listedObjects.Contents) === null || _b === void 0 ? void 0 : _b.length))
                            return [2 /*return*/];
                        return [4 /*yield*/, this.deleteFiles(listedObjects.Contents.map(function (k) { return k.Key; }))];
                    case 2:
                        result = _c.sent();
                        logger.log("Deleted:", result);
                        return [2 /*return*/];
                }
            });
        });
    };
    return S3Connection;
}());
exports.S3Connection = S3Connection;
