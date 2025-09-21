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
exports.KafkaConnection = exports.instances = void 0;
var utils_1 = require("@klapeks/utils");
var kafkajs_1 = require("kafkajs");
var kafka_producer_1 = require("./kafka.producer");
var kafka_consumer_1 = require("./kafka.consumer");
var logger = new utils_1.Logger("Kafka");
exports.instances = {
    producers: [],
    consumers: [],
};
var KafkaConnection = /** @class */ (function () {
    function KafkaConnection(clientId) {
        this.clientId = clientId;
        this.kafka = new kafkajs_1.Kafka({
            clientId: clientId,
            brokers: ['localhost:9092'],
            logCreator: function () { return function () { }; }
        });
    }
    KafkaConnection.prototype.createTopic = function (topic, partitions, replicas) {
        return __awaiter(this, void 0, void 0, function () {
            var admin, topics, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        admin = this.kafka.admin();
                        return [4 /*yield*/, admin.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, admin.fetchTopicMetadata({ topics: [topic] }).catch(function (err) { return null; })];
                    case 2:
                        topics = _a.sent();
                        logger.log("Topic infos:", topics === null || topics === void 0 ? void 0 : topics.topics);
                        if (!!(topics === null || topics === void 0 ? void 0 : topics.topics.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, admin.createTopics({
                                topics: [{
                                        topic: topic,
                                        numPartitions: partitions,
                                        replicationFactor: replicas
                                    }],
                            })];
                    case 3:
                        _a.sent();
                        logger.log("New topic created:", topic, '|', partitions, '|', replicas);
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(topics.topics[0].partitions.length < partitions)) return [3 /*break*/, 6];
                        logger.log("Malo partitions:", topics.topics[0].partitions.length);
                        // Увеличиваем число партиций
                        return [4 /*yield*/, admin.createPartitions({
                                topicPartitions: [{
                                        topic: topic,
                                        count: partitions, // новое общее количество партиций
                                    }],
                            })];
                    case 5:
                        // Увеличиваем число партиций
                        _a.sent();
                        logger.log("Topic partitions change:", topic, '|', partitions);
                        _a.label = 6;
                    case 6: return [4 /*yield*/, admin.alterConfigs({
                            validateOnly: false,
                            resources: [{
                                    type: kafkajs_1.ConfigResourceTypes.TOPIC,
                                    name: topic,
                                    configEntries: [{
                                            name: 'retention.ms',
                                            value: (24 * 60 * 60 * 1000).toString() // 86400000
                                        }]
                                }]
                        })];
                    case 7:
                        result = _a.sent();
                        logger.log("Alter config result:", result);
                        return [4 /*yield*/, admin.disconnect()];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    KafkaConnection.prototype.createProducer = function (config) {
        return new kafka_producer_1.KafkaProducer(this, config);
    };
    KafkaConnection.prototype.createConsumer = function (config) {
        return new kafka_consumer_1.KafkaConsumer(this, config);
    };
    KafkaConnection.cleanExit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var consumers, producers, _i, consumers_1, c, _a, producers_1, p;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        consumers = exports.instances.consumers;
                        producers = exports.instances.producers;
                        exports.instances.producers = [];
                        exports.instances.consumers = [];
                        _i = 0, consumers_1 = consumers;
                        _b.label = 1;
                    case 1:
                        if (!(_i < consumers_1.length)) return [3 /*break*/, 4];
                        c = consumers_1[_i];
                        return [4 /*yield*/, c.disconnect().catch(function (err) { return logger.error(err); })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        _a = 0, producers_1 = producers;
                        _b.label = 5;
                    case 5:
                        if (!(_a < producers_1.length)) return [3 /*break*/, 8];
                        p = producers_1[_a];
                        return [4 /*yield*/, p.disconnect().catch(function (err) { return logger.error(err); })];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        _a++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return KafkaConnection;
}());
exports.KafkaConnection = KafkaConnection;
function cleanExit() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, KafkaConnection.cleanExit()];
                case 1:
                    _a.sent();
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
process.on('SIGTERM', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, cleanExit()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, cleanExit()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
