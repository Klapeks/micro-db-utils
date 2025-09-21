import { SelectOptions } from "@klapeks/api-creation-tools";
import { RawMySQLConnection } from "../connections";
import { AbstractSelectHandler, SelectEntityHandlerOptions } from "./abstract.select.handler";


export type MySQLSelectEntityHandlerOptions<
    T extends object, K extends string
> = SelectEntityHandlerOptions<T, K> & {
    schemaTableName: string,
    mysql: RawMySQLConnection
}


export class MySQLSelectEntityHandler<T extends object, K extends string> 
    extends AbstractSelectHandler<T, K, MySQLSelectEntityHandlerOptions<T, K>> {

    constructor(options: MySQLSelectEntityHandlerOptions<T, K>) {
        super(options);
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
        let where = [] as [string, any][];
        let orderBy = '';
        let limit = '';

        // if (options.where) {
        //     const W = options.where as any;
        //     for (let key of Object.keys(W)) {
        //         if (typeof W[key] == 'undefined' || W[key] === null) continue;
        //         where.push([key, W[key]]);
        //     }
        // }
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

        const whereCondition = where?.length ? ('WHERE ' + where.map(w => w[0] + ' = ?').join(' AND ')) : ''; // TODO
        let result = await this.runSQL(`
            SELECT * FROM ${this.getTableName()}
            ${whereCondition} ${orderBy} ${limit}
        `, where.map(d => d[1]));

        const totalCount = await this.runSQL(`
            SELECT count(1) as 'count' 
            FROM ${this.getTableName()}
            ${whereCondition}
        `, where.map(d => d[1]));

        if (this.options.afterSelect) {
            result = await this.options.afterSelect(result, options);
        }
        return { objects: result, total: totalCount?.[0]?.count || NaN };
    }

}