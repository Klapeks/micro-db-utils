import { SelectOptions, SelectResult, TimedStatisticInfo, TimedStatisticInfoPart } from '@klapeks/api-creation-tools';
import { dateFromNow, toISODate } from '../utils/iso.date.time';

export interface SelectEntityHandlerOptions<
    T extends object, K extends string
> {
    name: K, 

    orderBy?: keyof T | (keyof T)[],
    /** @default "ASC" */
    orderType?: "ASC" | "DESC" | ("ASC" | "DESC")[],

    /** @default 100 */
    maxLimit?: number,

    afterSelect?: (objects: T[], options: SelectOptions<T>) => Promise<T[]>,
    // preBuilder?: (builder: SelectQueryBuilder<T>) => void | SelectQueryBuilder<T>
}

export abstract class AbstractSelectHandler<
    T extends object, K extends string, 
    O extends SelectEntityHandlerOptions<T, K>
> {

    readonly options: O;
    constructor(options: O) {
        this.options = options;
        if (!this.options.maxLimit) this.options.maxLimit = 100;
    }

    abstract getTableName(): string;
    abstract runSQL(query: string, params?: any[]): Promise<any[]>;
    async runSQL_One(query: string, params?: any[]): Promise<any> {
        const res = await this.runSQL(query, params);
        return res.length ? (res[0] || res) : null;
    }

    abstract getTotal(): Promise<number>;
    abstract rawSelect(options: SelectOptions<T>): Promise<{ objects: T[], total: number }>;


    async select(options: SelectOptions<T>) {
        const result = await this.rawSelect(options);
        return {
            size: result.objects.length,
            total: result.total,
            [this.options.name]: result.objects
        } as SelectResult<T, K>;
    }
    async sqlCount(field: string): Promise<number> {
        return (await this.runSQL_One(`
            SELECT count(${field}) as 'count'
            FROM ${this.getTableName()};
        `))?.count;
    }

    async getSumStatistic(sumField: keyof T, strWhere?: string): Promise<TimedStatisticInfo> {
        const stat = async (
            fromDate: Date | ((date: Date) => void), time?: string
        ): Promise<TimedStatisticInfoPart> => {
            if (typeof fromDate == 'function') {
                fromDate = dateFromNow(fromDate);
            }
            const isoDate = toISODate(fromDate, 'yyyy-mm-dd');
            const sum = (await this.runSQL_One(`
                SELECT SUM(${sumField as string}) as sum
                FROM ${this.getTableName()}
                WHERE ${time ? `createdAt >= '${isoDate} ${time}'` 
                    : `date(createdAt) >= date('${isoDate}')`}
                ${strWhere ? ('AND (' + strWhere + ')') : ''}
            `))?.sum || 0;
            return {
                from: isoDate + ' ' + (time || '00:00:00'), sum,
            }
        }
        const time = new Date().toLocaleTimeString('uk-UA');
        // For Test: 
        // UPDATE flow_data SET createdAt=ADDDATE(createdAt, INTERVAL 1 DAY) WHERE 1;
        // UPDATE flow_data SET updatedAt=createdAt WHERE 1;

        const response: TimedStatisticInfo = {
            serverTime: time,
            count: await this.getTotal()
        }

        response.total = {
            from: new Date(0), // TODO get first?
            sum: (await this.runSQL_One(`
                SELECT SUM(${sumField as string}) as sum
                FROM ${this.getTableName()}
                ${strWhere ? ("WHERE " + strWhere) : ''}
            `))?.sum as number
        };

        response.thisDay = await stat(new Date());
        response.thisWeek = await stat(d => d.setDate(d.getDate() - (d.getDay() || 7) + 1));
        response.thisMonth = await stat(d => d.setDate(1));
        response.thisYear = await stat(d => { d.setMonth(0); d.setDate(1); });
        
        response.past24hours = await stat(d => d.setDate(d.getDate() - 1), time);
        response.past3days = await stat(d => d.setDate(d.getDate() - 2));

        response.past7days = await stat(d => d.setDate(d.getDate() - 6));
        response.past14days = await stat(d => d.setDate(d.getDate() - 13));
        response.past30days = await stat(d => d.setDate(d.getDate() - 29));

        response.past6months = await stat(d => d.setMonth(d.getMonth() - 6));
        response.past12months = await stat(d => d.setMonth(d.getMonth() - 12));

        return response;
    }

    async handleQuery(req: any): Promise<SelectOptions<T>> {
        const options: SelectOptions<T> = {
            limit: Number(req.query.limit),
            offset: Number(req.query.offset)
        }
        if (!options.limit || options.limit < 0) throw "Invalid limit field";
        if (options.limit > (this.options.maxLimit || 100)) throw "Too much limit"

        if (typeof req.query.where == 'object') {
            options.where = req.query.where as any;
        }

        return options;
    }
}