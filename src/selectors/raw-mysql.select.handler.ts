import { type SelectOptions } from "@klapeks/api-creation-tools";
import { AbstractSelectHandler, SelectEntityHandlerOptions } from "./abstract.select.handler";
import { DatabaseOptions, logger } from "@klapeks/utils";
import { MySQLConnection } from "../sql";


export type MySQLSelectEntityHandlerOptions<
    T extends object, K extends string
> = SelectEntityHandlerOptions<T, K> & {
    schemaTableName: string,
    mysql: MySQLConnection,
    beforeGetMany?: (options: SelectOptions<T>) => Promise<void> | void,
    debugLogs?: boolean,
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
        if (this.options.beforeGetMany) {
            await this.options.beforeGetMany(options);
        }

        let orderBy = '';
        let limit = '';
        if (this.options.orderBy) {
            orderBy = 'ORDER BY ';
            
            // multiple order // TODO TEST SOMEHOW
            const addOrderBy = (field: string, _index = 0) => {
                let orderType = 'ASC';
                if (Array.isArray(this.options.orderType)) {
                    orderType = this.options.orderType[_index] || this.options.orderType[0]
                } else {
                    orderType = this.options.orderType || 'ASC';
                }
                orderBy += field + ' ' + orderType.toUpperCase();
            }
            if (Array.isArray(this.options.orderBy)) {
                for (let i = 0; i < this.options.orderBy.length; i++) {
                    if (i) orderBy += ', ';
                    addOrderBy(this.options.orderBy[i] as any, i);
                }
            } else {
                addOrderBy(this.options.orderBy as any, 0);
            }
        }
        if (options.limit) {
            limit = 'LIMIT '  + options.limit;
            if (options.offset) {
                limit += ' OFFSET ' + options.offset;
            }
        }

        let _whereConditions = '';
        let _whereArgs = [] as any[];
        if (options.where) {
            const multipleOrWheres = Array.isArray(options.where) ? options.where : [options.where];
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
                        _whereArgs.push(strVal);
                        continue;
                    }
                    conditionPart.push(key + ' = ?');
                    _whereArgs.push(where[key]);
                }

                if (!conditionPart?.length) continue;
                if (i) _whereConditions += ' OR ';
                _whereConditions += '(' + conditionPart.join(" AND ") + ')'; 
            }
        }
        if (_whereConditions) {
            if (this.options.mysql.isDebugLoggerEnabled || this.options.debugLogs) {
                logger.log('RawMysql Where Query:', _whereConditions, '\n|\t Args:', JSON.stringify(_whereArgs));
            }
            _whereConditions = 'WHERE ' + _whereConditions;
        }


        // let where = [] as [string, any][];
        // const whereCondition = where?.length ? ('WHERE ' + where.map(w => w[0] + ' = ?').join(' AND ')) : ''; // TODO
       
        let result = await this.runSQL(`
            SELECT * FROM ${this.getTableName()}
            ${_whereConditions} ${orderBy} ${limit}
        `, _whereArgs);

        const totalCount = await this.runSQL(`
            SELECT count(1) as 'count' 
            FROM ${this.getTableName()}
            ${_whereConditions}
        `, _whereArgs);

        if (this.options.afterSelect) {
            result = await this.options.afterSelect(result, options);
        }
        return { objects: result, total: totalCount?.[0]?.count || NaN };
    }

}