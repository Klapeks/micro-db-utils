"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawMySQLConnection = exports.createSQLConnection = exports.isDatabaseTypeIs = void 0;
var mysql_connection_1 = require("./mysql.connection");
Object.defineProperty(exports, "RawMySQLConnection", { enumerable: true, get: function () { return mysql_connection_1.MySQLConnection; } });
var mssql_connection_1 = require("./mssql.connection");
function isDatabaseTypeIs(options, type) {
    return options.type === type;
}
exports.isDatabaseTypeIs = isDatabaseTypeIs;
function createSQLConnection(options) {
    if (isDatabaseTypeIs(options, 'mysql'))
        return new mysql_connection_1.MySQLConnection(options);
    if (isDatabaseTypeIs(options, 'mssql'))
        return new mssql_connection_1.MSSQLConnection(options);
    throw "Connection for database type " + options.type + ' is not implemented :(';
}
exports.createSQLConnection = createSQLConnection;
__exportStar(require("./abstract.connection"), exports);
__exportStar(require("./mysql.connection"), exports);
__exportStar(require("./mssql.connection"), exports);
