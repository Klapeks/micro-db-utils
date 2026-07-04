"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.microDBUtilsConfig = void 0;
exports.microDBUtilsConfig = {
    debugSQL: process.env.DEBUG_SQL == 'true'
        || process.env.SQL_DEBUG == 'true'
};
