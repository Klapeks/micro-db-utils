import { Brackets, DataSource, EntitySchema, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { AbstractSelectHandler, SelectEntityHandlerOptions } from './abstract.select.handler';
import { SelectOptions } from '@klapeks/api-creation-tools';


export type TypeormSelectEntityHandlerOptions<
    T extends ObjectLiteral, K extends string
> = SelectEntityHandlerOptions<T, K> & {
    schema: EntitySchema<T>, 
    dataSource: DataSource,
    beforeGetMany?: (builder: SelectQueryBuilder<T>, options: SelectOptions<T>) => Promise<void> | void
}

export class SelectEntityHandler<T extends ObjectLiteral, K extends string> 
    extends AbstractSelectHandler<T, K, TypeormSelectEntityHandlerOptions<T, K>> {

    constructor(options: TypeormSelectEntityHandlerOptions<T, K>) {
        super(options);
    }

    get dataSource() { return this.options.dataSource; }
    get schema() { return this.options.schema; }
    get repo() { return this.dataSource.getRepository(this.schema); }

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
                // qb1 = qb1.where('0 = 1');
                for (let i = 0; i < multipleWheres.length; i++) {
                    const where = multipleWheres[i];
                    qb1 = qb1.orWhere(new Brackets(qb2 => {
                        for (let key of Object.keys(where)) {
                            const placeholderKey = key + "_" + i;
                            if (typeof where[key] == undefined) continue;
                            if (where[key] == null) {
                                qb2 = qb2.andWhere('key is NULL');
                                continue;
                            }
                            if (typeof where[key] == 'string' && (where[key] as string).startsWith('{like}=')) {
                                const strVal = (where[key] as string).substring(7).toLowerCase();
                                qb2 = qb2.andWhere('lower('  + key + ') like :' + placeholderKey, { [placeholderKey]: strVal });
                                continue;
                            }
                            qb2 = qb2.andWhere(key + ' = :' + placeholderKey, { [placeholderKey]: where[key] });
                        }
                    }))
                }
            }));
        }

        if (this.options.beforeGetMany) {
            await this.options.beforeGetMany(builder, options);
        }

        builder.limit(options.limit);
        if (options.offset) builder.offset(options.offset);

        // logger.log('typeorm select query:', builder.getQuery());
        let result = await builder.getRawMany();
        if (this.options.afterSelect) {
            result = await this.options.afterSelect(result, options);
        }
        return { objects: result, total: await builder.getCount() };
    }

}