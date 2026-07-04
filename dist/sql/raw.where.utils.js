"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.converWhereQuery = void 0;
var typeorm_1 = require("typeorm");
function sqlQuoteKey(dbType, str) {
    if (dbType === 'mysql')
        return "`".concat(str, "`");
    if (dbType === 'mssql')
        return "[".concat(str, "]");
    return str;
}
function converWhereQuery(dbType, key, value, keyAlias) {
    var _a;
    if (value instanceof typeorm_1.FindOperator) {
        if (value.type === 'isNull') {
            return sqlQuoteKey(dbType, key) + ' IS NULL';
        }
        if (value.type === 'not') {
            if (((_a = value.child) === null || _a === void 0 ? void 0 : _a.type) === 'isNull') {
                return sqlQuoteKey(dbType, key) + ' IS NOT NULL';
            }
        }
    }
    if (value === null) {
        return sqlQuoteKey(dbType, key) + ' IS NULL';
    }
    if (keyAlias === '?' || dbType === 'mysql') {
        return sqlQuoteKey(dbType, key) + " = ?";
    }
    if (dbType === 'mssql') {
        return "[".concat(key, "] = @").concat(keyAlias || key);
    }
    return sqlQuoteKey(dbType, key) + " = :".concat(keyAlias || key);
}
exports.converWhereQuery = converWhereQuery;
