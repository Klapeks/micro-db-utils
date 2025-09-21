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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runRawBackup = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var child_process_1 = require("child_process");
var os_1 = __importDefault(require("os"));
var utils_1 = require("@klapeks/utils");
var pad = function (s) { return s < 10 ? "0".concat(s) : s; };
function dateToStr(date) {
    return date.getFullYear()
        + '-' + pad(date.getMonth() + 1)
        + '-' + pad(date.getDate());
}
function runRawBackup(_a) {
    var _b;
    var module = _a.module, options = _a.options, tables = _a.tables, outputFolder = _a.outputFolder;
    return __awaiter(this, void 0, void 0, function () {
        var date, filePath_1, file_1, dump_1, stat, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!options.type)
                        return [2 /*return*/];
                    if (!(tables === null || tables === void 0 ? void 0 : tables.length))
                        return [2 /*return*/];
                    if (os_1.default.platform() == 'win32')
                        return [2 /*return*/];
                    if (!fs_1.default.existsSync(outputFolder)) {
                        fs_1.default.mkdirSync(outputFolder, { recursive: true });
                    }
                    utils_1.logger.log("Starting database backup:", options.type, '|', tables);
                    date = new Date();
                    if (!(options.type == 'mysql')) return [3 /*break*/, 4];
                    filePath_1 = path_1.default.join(outputFolder, 'backup-' + dateToStr(date) + '-' + module + '.sql');
                    if (fs_1.default.existsSync(filePath_1))
                        fs_1.default.rmSync(filePath_1, { force: true });
                    file_1 = fs_1.default.createWriteStream(filePath_1);
                    file_1.write('-- BSB v4 dump. Tables: ' + tables.join(', ') + '\n');
                    file_1.write('-- DateTime: ' + new Date().toISOString().replace('T', ' ').replace('Z', '') + '\n');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    dump_1 = (0, child_process_1.spawn)('mysqldump', __spreadArray([
                        '--skip-extended-insert',
                        '--host=' + options.host,
                        '--port=' + options.port,
                        '--user=' + options.username,
                        '--password=' + options.password,
                        '--databases', options.database,
                        '--tables'
                    ], tables, true));
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var error = '';
                            dump_1.stdout.on('data', function (data) { return file_1.write(data); });
                            dump_1.stderr.on('data', function (data) {
                                if (String(data).toLowerCase().includes('[warning]'))
                                    return;
                                error += String(data);
                            });
                            dump_1.once('exit', function (code) {
                                dump_1.kill();
                                if (code) {
                                    utils_1.logger.log('child process exited with code ' + code);
                                    return reject(error);
                                }
                                resolve("Done");
                            });
                        })];
                case 2:
                    _c.sent();
                    file_1.end();
                    utils_1.logger.log("└ Backup completed and saved at\n", filePath_1);
                    stat = fs_1.default.statSync(filePath_1);
                    utils_1.logger.log("└ Backup size:", +(stat.size / 1024).toFixed(2), 'KB', '/', +(stat.size / 1024 / 1024).toFixed(2), 'MB');
                    return [2 /*return*/];
                case 3:
                    err_1 = _c.sent();
                    file_1.end(function () {
                        fs_1.default.rmSync(filePath_1, { force: true });
                    });
                    if ((_b = err_1 === null || err_1 === void 0 ? void 0 : err_1.sqlMessage) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes("unknown database"))
                        return [2 /*return*/];
                    utils_1.logger.error("Error while backuping database:", err_1);
                    return [2 /*return*/];
                case 4: throw "Unknown database type for backup: " + options.type;
            }
        });
    });
}
exports.runRawBackup = runRawBackup;
// export function runMicroBackup(micro: MicroServer, dataSource: DataSource) {
//     return runRawBackup({
//         module: micro.options.microServer, 
//         options: dataSourceOptions(),
//         tables: Object.values(dataSource.options.entities || []).map((m: any) => {
//             if (m instanceof EntitySchema) return m.options.name;
//             return undefined;
//         }).filter(Boolean) as string[],
//         outputFolder: minEnv.coreDataFile('backups')
//     })
// }
// export async function initBackups(micro: MicroServer, dataSource: DataSource) {
//     cron.schedule('50 23 * * *', async () => {
//         await runMicroBackup(micro, dataSource);
//     });
//     await runMicroBackup(micro, dataSource);
// }
