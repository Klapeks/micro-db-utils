import { type SelectOptions } from "@klapeks/api-creation-tools";
import { AbstractSelectHandler, SelectEntityHandlerOptions } from "./abstract.select.handler";
import { DatabaseOptions, logger } from "@klapeks/utils";
import { MySQLConnection } from "../sql";


export type MySQLSelectEntityHandlerOptions<
    T extends object, K extends string
> = SelectEntityHandlerOptions<T, K> & {
    schemaTableName: string,
    mysql: MySQLConnection,
    beforeGetMany?: (
        builder: MySQLSelectEntityQueryBuilder, 
        options: SelectOptions<T>
    ) => Promise<void> | void,
    debugLogs?: boolean,
}

export interface MySQLSelectEntityQueryBuilder {
    select?: string,
    leftJoin?: string,
    leftJoinInCountToo?: boolean,
    whereCondition?: string,
    whereArgs?: any[],
    orderBy?: string,
}


export class MySQLSelectEntityHandler<T extends object, K extends string> 
    extends AbstractSelectHandler<T, K, MySQLSelectEntityHandlerOptions<T, K>> {

    constructor(options: MySQLSelectEntityHandlerOptions<T, K>) {
        super(options);
    }

    getDatabaseType(): DatabaseOptions['type'] {
        return 'mysql';
    }
    getTableName(): string {
        return this.options.schemaTableName;
    }
    override async runSQL(sql: string, params?: any[]): Promise<any[]> {
        return this.options.mysql.runSQL(sql, params);
    }
    
    async getTotal(): Promise<number> {
        return (await this.runSQL_One(`
            SELECT count(1) as 'count'
            FROM ${this.getTableName()};
        `))?.count;
    }
    
    async rawSelect(options: SelectOptions<T>): Promise<{ objects: T[], total: number }> {
        const queryBuilder: MySQLSelectEntityQueryBuilder = {
            select: "*",
            leftJoin: "",
            whereCondition: "",
            whereArgs: [],
            orderBy: "",
        };

        // before get many
        if (this.options.beforeGetMany) {
            await this.options.beforeGetMany(queryBuilder, options);
        }

        // orderBy
        if (this.options.orderBy) {
            // multiple order
            const addOrderBy = (field: string, _index = 0) => {
                let orderType = 'ASC';
                if (Array.isArray(this.options.orderType)) {
                    orderType = this.options.orderType[_index] || this.options.orderType[0]
                } else {
                    orderType = this.options.orderType || 'ASC';
                }
                if (!queryBuilder.orderBy) queryBuilder.orderBy = '';
                queryBuilder.orderBy += field + ' ' + orderType.toUpperCase();
            }
            if (Array.isArray(this.options.orderBy)) {
                for (let i = 0; i < this.options.orderBy.length; i++) {
                    if (queryBuilder.orderBy) queryBuilder.orderBy += ', ';
                    addOrderBy(this.options.orderBy[i] as any, i);
                }
            } else {
                addOrderBy(this.options.orderBy as any, 0);
            }
        }

        // where
        if (options.where) {
            if (!queryBuilder.whereArgs) queryBuilder.whereArgs = [];
            const multipleOrWheres = Array.isArray(options.where) ? options.where : [options.where];
            if (queryBuilder.whereCondition) {
                if (queryBuilder.whereCondition.toLowerCase().startsWith('where ')) {
                    queryBuilder.whereCondition = queryBuilder.whereCondition.substring(6);
                }
                queryBuilder.whereCondition = '(' + queryBuilder.whereCondition + ')';
            }
            for (let i = 0; i < multipleOrWheres.length; i++) {
                let conditionPart = [] as string[];
                const where = multipleOrWheres[i] as any;
                let j = 0;

                for (let key of Object.keys(where)) {
                    if (typeof where[key] === 'undefined') continue;
                    if (where[key] == null) {
                        conditionPart.push(key + ' IS NULL');
                        continue;
                    }
                    if (typeof where[key] == 'string' && (where[key] as string).startsWith('{like}=')) {
                        const strVal = (where[key] as string).substring(7).toLowerCase();
                        conditionPart.push('LOWER('  + key + ') LIKE ?');
                        queryBuilder.whereArgs.push(strVal);
                        continue;
                    }
                    conditionPart.push(key + ' = ?');
                    queryBuilder.whereArgs.push(where[key]);
                }

                if (!conditionPart?.length) continue;
                if (!queryBuilder.whereCondition) queryBuilder.whereCondition = '';
                else queryBuilder.whereCondition += ' OR ';
                queryBuilder.whereCondition += '(' + conditionPart.join(" AND ") + ')'; 
            }
            if (queryBuilder.whereCondition) {
                queryBuilder.whereCondition = '(' + queryBuilder.whereCondition + ')';
            }
        }

        // fixes
        if (queryBuilder.whereCondition) {
            if (!queryBuilder.whereCondition.toLowerCase().startsWith('where ')) {
                queryBuilder.whereCondition = 'WHERE ' + queryBuilder.whereCondition;
            }
            if (this.options.mysql.isDebugLoggerEnabled || this.options.debugLogs) {
                logger.log('RawMysql Where Query:', queryBuilder.whereCondition, 
                    '\n|\t Args:', JSON.stringify(queryBuilder.whereArgs));
            }
        }
        if (queryBuilder.leftJoin) {
            if (!queryBuilder.leftJoin.toLowerCase().startsWith('left join ')) {
                queryBuilder.leftJoin = 'LEFT JOIN ' + queryBuilder.leftJoin;
            }
        }

        // limit
        let limitQuery = '';
        if (options.limit) {
            limitQuery = 'LIMIT '  + options.limit;
            if (options.offset) {
                limitQuery += ' OFFSET ' + options.offset;
            }
        }
        
        let result = await this.runSQL([
            'SELECT ' + (queryBuilder.select || '*'),
            'FROM ' + this.getTableName(),
            queryBuilder.leftJoin,
            queryBuilder.whereCondition,
            queryBuilder.orderBy, 
            limitQuery
        ].filter(Boolean).join('\n'), 
            queryBuilder.whereArgs
        );

        const totalCount = await this.runSQL([
            `SELECT count(1) as 'count'`,
            'FROM ' + this.getTableName(),
            queryBuilder.leftJoinInCountToo 
                ? queryBuilder.leftJoin : '',
            queryBuilder.whereCondition,
        ].filter(Boolean).join('\n'), 
            queryBuilder.whereArgs
        );

        if (this.options.afterSelect) {
            result = await this.options.afterSelect(result, options);
        }
        return { objects: result, total: totalCount?.[0]?.count || NaN };
    }

}