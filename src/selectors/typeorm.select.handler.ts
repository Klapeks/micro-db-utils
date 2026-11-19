import { Brackets, DataSource, EntitySchema, ObjectLiteral, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm';
import { AbstractSelectHandler, SelectEntityHandlerOptions } from './abstract.select.handler';
import { type SelectOptions } from '@klapeks/api-creation-tools';
import { DatabaseOptions } from '@klapeks/utils';


export type TypeormSelectEntityHandlerOptions<
    T extends ObjectLiteral, K extends string
> = SelectEntityHandlerOptions<T, K> & {
    schema: EntitySchema<T>, 
    dataSource: DataSource,
    typeormHydrateValue?: boolean,
    beforeGetMany?: (builder: SelectQueryBuilder<T>, options: SelectOptions<T>) => Promise<void> | void
}


const parseWhereOnWhereBuilder = (
    qbOr1: WhereExpressionBuilder, 
    multipleWheres: SelectOptions.Where<any>[],
    type: "or" | "and"
) => {
    if (!multipleWheres) return;
    if (!Array.isArray(multipleWheres)) throw "multipleWheres arg is not array";
    for (let i = 0; i < multipleWheres.length; i++) {
        const where = multipleWheres[i];
        qbOr1 = (type == 'and' ? qbOr1.andWhere 
        : qbOr1.orWhere)(new Brackets(qbAnd2 => {
            for (let key of Object.keys(where)) {
                if (typeof where[key] === 'undefined') continue;
                if (key === '$and') {
                    qbAnd2.andWhere(new Brackets(qbOr3 => {
                        parseWhereOnWhereBuilder(qbOr3, where[key] as any, 'and');
                    }));
                    continue;
                }
                if (key === '$or') {
                    qbAnd2.orWhere(new Brackets(qbOr3 => {
                        parseWhereOnWhereBuilder(qbOr3, where[key] as any, 'or');
                    }));
                    continue;
                }
                if (where[key] === null) {
                    qbAnd2 = qbAnd2.andWhere(key + ' IS NULL');
                    continue;
                }
                if (where[key] === '{not}=null' || where[key] === '{not}=NULL') {
                    qbAnd2 = qbAnd2.andWhere(key + ' IS NOT NULL');
                    continue;
                }
                
                const placeholderKey = key + "_" + i;
                if (typeof where[key] === 'string') {
                    if ((where[key] as string).startsWith('{like}=')) {
                        const strVal = (where[key] as string).substring(7).toLowerCase();
                        qbAnd2 = qbAnd2.andWhere(
                            'LOWER('  + key + ') LIKE :' + placeholderKey, 
                            { [placeholderKey]: strVal }
                        );
                        continue;
                    }
                    if ((where[key] as string).startsWith('{not}=')) {
                        const strVal = (where[key] as string).substring(6).toLowerCase();
                        qbAnd2 = qbAnd2.andWhere(
                            key + ' != :' + placeholderKey,
                            { [placeholderKey]: strVal }
                        );
                        continue;
                    }
                }
                qbAnd2 = qbAnd2.andWhere(
                    key + ' = :' + placeholderKey, 
                    { [placeholderKey]: where[key] }
                );
            }
        }))
    }
}

export class SelectEntityHandler<T extends ObjectLiteral, K extends string> 
    extends AbstractSelectHandler<T, K, TypeormSelectEntityHandlerOptions<T, K>> {

    constructor(options: TypeormSelectEntityHandlerOptions<T, K>) {
        super(options);
    }

    get dataSource() { return this.options.dataSource; }
    get schema() { return this.options.schema; }
    get repo() { return this.dataSource.getRepository(this.schema); }

    getDatabaseType(): DatabaseOptions['type'] {
        return this.dataSource.options.type as any;
    }
    getTableName(): string {
        return this.schema.options.name;
    }
    override async runSQL(sql: string, params?: any[]): Promise<any[]> {
        return this.dataSource.query(sql, params);
    }
    async getTotal(): Promise<number> {
        return this.repo.count();
    }
    async rawSelect(options: SelectOptions<T>): Promise<{ objects: T[], total: number }> {
        const builder = this.repo.createQueryBuilder(this.schema.options.name);
        builder.select(this.schema.options.name + '.*');
        // if (this.options.preBuilder) this.options.preBuilder(builder);
        if (this.options.orderBy) {
            // multiple order
            const addOrderBy = (field: string, _index = 0) => {
                let orderType = 'ASC';
                if (Array.isArray(this.options.orderType)) {
                    orderType = this.options.orderType[_index] || this.options.orderType[0]
                } else {
                    orderType = this.options.orderType || 'ASC';
                }
                if (_index) builder.addOrderBy(field, orderType.toUpperCase() as any);
                else builder.orderBy(field, orderType.toUpperCase() as any);
            }
            if (Array.isArray(this.options.orderBy)) {
                for (let i = 0; i < this.options.orderBy.length; i++) {
                    addOrderBy(this.options.orderBy[i] as any, i);
                }
            } else {
                addOrderBy(this.options.orderBy as any, 0);
            }
        }
        if (options.where) {
            const multipleWheres = Array.isArray(options.where) ? options.where : [options.where];
            builder.andWhere(new Brackets((qb1) => {
                parseWhereOnWhereBuilder(qb1, multipleWheres, 'or');
            }));
        }

        if (this.options.beforeGetMany) {
            await this.options.beforeGetMany(builder, options);
        }

        builder.limit(options.limit);
        if (options.offset) builder.offset(options.offset);

        // logger.log('typeorm select query:', builder.getQuery());
        let result = await builder.getRawMany();

        if (this.options.typeormHydrateValue) {
            const $columns = builder.expressionMap.mainAlias?.metadata?.columns;
            if ($columns) for (let row of result) {
                for (let column of $columns) {
                    (row as any)[column.databaseName] = this.dataSource
                        .driver.prepareHydratedValue(
                            (row as any)[column.databaseName], column
                        );
                }
            }
        }
        
        if (this.options.afterSelect) {
            result = await this.options.afterSelect(result, options);
        }
        return { objects: result, total: await builder.getCount() };
    }

}