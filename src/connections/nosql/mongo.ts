import { DatabaseOptions, Flatten, logger } from "@klapeks/utils";
import type { Schema as MongooseSchema, PipelineStage, QuerySelector } from "mongoose";
import { Point } from "typeorm";
import { quietRequire } from "../quiet.require";

const mongooseModule = quietRequire<typeof import('mongoose')>('mongoose');

export type MongoDBConnectOptions = Omit<DatabaseOptions & { type: "mysql" }, "type"> & { type: "mongo" };

export type MongoSearchQuery<T extends object> = {
    [K in keyof Flatten<T>]?: Flatten<T>[K] | QuerySelector<Flatten<T>[K]>
}

export function flattenForUpdate<T extends object>(object: T, prefix = ''): Partial<Flatten<T>> {
    const _o = object as any;
    let result: any = {};

    for (let key of Object.keys(object) as any[]) {
        if (typeof key != 'string' && typeof key != 'number') continue;
        if (_o[key] === undefined) continue;
        if (_o[key] === null || Array.isArray(_o[key]) || (_o[key] instanceof Date)) {
            result[prefix + key] = _o[key];
            continue;
        }
        if (typeof _o[key] == 'object') {
            const nested = flattenForUpdate(_o[key], prefix + key + '.');
            Object.assign(result, nested);
            continue;
        }
        result[prefix + key] = _o[key];
    }

    return result;
}


export function cursorOffsetAggregation<T extends object>(
    sortField: keyof Flatten<T>, lastValue: number | string, fieldSort: 'asc' | 'desc',
    idField: keyof Flatten<T>, lastId: number | string
): PipelineStage {
    return {
        $match: {
            $or: [{
                [sortField]: { [fieldSort == 'asc' ? '$gt' : '$lt']: lastValue }
            }, {
                [sortField]: lastValue, [idField]: { $gt: lastId }
            }]
        }
    } as any;
}

let _databaseName = '';
export class MongoDBConnection {

    static createCounter<T extends string>(name = 'Counter') {
        // @ts-ignore
        const _CounterSchema = new mongoose.Schema<{
            model: string,
            counter: number
        }>({
            model: { type: String, required: true, unique: true },
            counter: { type: Number, default: 0 }
        }, {
            versionKey: false
        });
        const CounterModel = mongooseModule?.model(name, _CounterSchema);
        return {
            model: CounterModel,
            increment: async (model: T, increment = 1) => {
                const counter = await CounterModel.findOneAndUpdate(
                    { model: model },
                    { $inc: { counter: increment } }, // безопасно при параллелизме
                    { new: true, upsert: true } // создаёт запись при первом вызове
                );
                return counter.counter;
            },
            set: async (model: T, value: number) => {
                const counter = await CounterModel.findOneAndUpdate(
                    { model: model },
                    { $set: { counter: value } }, // безопасно при параллелизме
                    { new: true, upsert: true } // создаёт запись при первом вызове
                );
                return counter.counter;
            }
        } as const;
    }

    static getOptions(): MongoDBConnectOptions {
        return {
            // type: "mongo",
            type: "mongo",
            host: process.env.MONGO_DATABASE_HOST || '127.0.0.1',
            port: Number(process.env.MONGO_DATABASE_PORT || '27017'),
            username: process.env.MONGO_DATABASE_LOGIN || '',
            password: process.env.MONGO_DATABASE_PASSWORD || '',
            logging: true,
            database: ""
        }
    }

    static async init(databaseName: string) {
        if (_databaseName) return;

        const { host, port, password, username } = this.getOptions();

        const mongoURI = 'mongodb://' + host + ':' + port + '/' + databaseName;

        // logger.log(mongoURI);
        if (!mongooseModule) throw new Error("No mongoose module");
        await mongooseModule.connect(mongoURI, {
            auth: username ? {
                username: username,
                password: password,
            } : undefined,
            authSource: "admin"
        });
        _databaseName = databaseName;
        logger.log("Mongo connected to database:", databaseName);
    }
}

function _createDefaultMongoSchemas(): {
    MongoGeoPoint: MongooseSchema<Point>
} {
    if (!mongooseModule) return {} as any;
    return {
        MongoGeoPoint: new mongooseModule.Schema<Point>({
            type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point'
            },
            coordinates: {
                type: [Number],  // [долгота, широта]
                required: true
            }
        }, { _id: false })
    }
}

export const { MongoGeoPoint } = _createDefaultMongoSchemas();