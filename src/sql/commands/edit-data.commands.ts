import { DatabaseOptions } from "@klapeks/utils";
import { MicroColumnTypeObject } from "../column.type.parser";
import { ISQLCommandAdapter } from "./abstract.sql.command";
import { FindOperator, IsNull } from "typeorm";
import { converWhereQuery } from "../raw.where.utils";

export class SQLEditDataCommands {
    
    constructor(private readonly table: string) {}


    update(data: any, where: any): ISQLCommandAdapter {
        return {
            toMySQL: () => ({
                query: `
                    UPDATE \`${this.table}\`
                    SET ${Object.keys(data).map(key => `\`${key}\` = ?`).join(',')}
                    WHERE ${Object.keys(where).map(key => converWhereQuery(
                        'mysql', key, data[key], '?')).join(' AND ')};
                `,
                params: [
                    ...Object.values(data),
                    ...Object.values(where),
                ]
            }),
            toMSSQL: () => ({
                query: `
                    UPDATE [${this.table}] 
                    SET ${Object.keys(data).map(key => `[${key}] = @${key}`).join(',')}
                    WHERE ${Object.keys(where).map(key => converWhereQuery(
                        'mssql', key, data[key], 'where_' + key)).join(' AND ')};
                `,
                params: (() => {
                    const params: any = {...data};
                    for (let key of Object.keys(where)) {
                        params['where_' + key] = where[key];
                    }
                    return params;
                })()
            }),
        }
    }

    upsert(data: any, idKeys: string[]): ISQLCommandAdapter {
        if (!data) throw "No data param";
        if (!idKeys?.length) throw "No idKeys param";
        if (Object.keys(data).length <= idKeys.length) {
            throw "Nothing to update";
        }
        const dataKeys = Object.keys(data);
        const toUpdObj: any = {};
        for (let key of dataKeys) {
            if (idKeys.includes(key)) continue;
            toUpdObj[key] = data[key];
        }
        return {
            toMySQL: () => ({
                query: `
                    INSERT INTO \`${this.table}\` 
                    (${dataKeys.map(a => `\`${a}\``).join(', ')})
                    VALUES (${dataKeys.map(() => '?').join(', ')})
                    ON DUPLICATE KEY UPDATE ${Object.keys(toUpdObj)
                        .map((key) => `\`${key}\` = ?`).join(', ')};
                `,
                params: [
                    ...Object.values(data),
                    ...Object.values(toUpdObj),
                ]
            }),
            toMSSQL: () => ({
                query: `
                    UPDATE [${this.table}] 
                    SET ${Object.keys(toUpdObj).map(key => `[${key}] = @${key}`).join(',')}
                    WHERE ${idKeys.map(key => converWhereQuery(
                        'mssql', key, data[key], key)).join(' AND ')};

                    IF @@ROWCOUNT = 0 INSERT INTO [${this.table}]
                        (${dataKeys.map(a => `[${a}]`).join(', ')})
                        VALUES (${dataKeys.map((key) => '@' + key).join(', ')});
                `,
                params: data
            }),
        }
    }
}