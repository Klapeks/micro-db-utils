import { DatabaseOptions } from "@klapeks/utils";
import { FindOperator } from "typeorm";


function sqlQuoteKey(dbType: DatabaseOptions['type'], str: string) {
    if (dbType === 'mysql') return `\`${str}\``;
    if (dbType === 'mssql') return `[${str}]`;
    return str;
}

export function converWhereQuery(dbType: DatabaseOptions['type'], key: string, value: any, keyAlias?: string) {
    if (value instanceof FindOperator) {
        if (value.type === 'isNull') {
            return sqlQuoteKey(dbType, key) + ' IS NULL';
        }
        if (value.type === 'not') {
            if (value.child?.type === 'isNull') {
                return sqlQuoteKey(dbType, key) + ' IS NOT NULL';
            }
        }
    }
    if (value === null) {
        return sqlQuoteKey(dbType, key) + ' IS NULL';
    }
    if (keyAlias === '?' || dbType === 'mysql') {
        return sqlQuoteKey(dbType, key) + ` = ?`;
    }
    if (dbType === 'mssql') {
        return `[${key}] = @${keyAlias || key}`;
    }
    return sqlQuoteKey(dbType, key) + ` = :${keyAlias || key}`;
}