import { DatabaseOptions, Flatten } from "@klapeks/utils";
import mongoose, { PipelineStage, QuerySelector } from "mongoose";
import { Point } from "typeorm";
export type MongoDBConnectOptions = Omit<DatabaseOptions & {
    type: "mysql";
}, "type"> & {
    type: "mongo";
};
export type MongoSearchQuery<T extends object> = {
    [K in keyof Flatten<T>]?: Flatten<T>[K] | QuerySelector<Flatten<T>[K]>;
};
export declare function flattenForUpdate<T extends object>(object: T, prefix?: string): Partial<Flatten<T>>;
export declare function cursorOffsetAggregation<T extends object>(sortField: keyof Flatten<T>, lastValue: number | string, fieldSort: 'asc' | 'desc', idField: keyof Flatten<T>, lastId: number | string): PipelineStage;
export declare class MongoDBConnection {
    static createCounter<T extends string>(name?: string): {
        readonly model: mongoose.Model<{
            model: string;
            counter: number;
        }, {}, {}, {}, mongoose.Document<unknown, {}, {
            model: string;
            counter: number;
        }, {}, mongoose.DefaultSchemaOptions> & {
            model: string;
            counter: number;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }, mongoose.Schema<{
            model: string;
            counter: number;
        }, mongoose.Model<{
            model: string;
            counter: number;
        }, any, any, any, mongoose.Document<unknown, any, {
            model: string;
            counter: number;
        }, any, {}> & {
            model: string;
            counter: number;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
            model: string;
            counter: number;
        }, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
            model: string;
            counter: number;
        }>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
            model: string;
            counter: number;
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }>>;
        readonly increment: (model: T, increment?: number) => Promise<number>;
        readonly set: (model: T, value: number) => Promise<number>;
    };
    static getOptions(): MongoDBConnectOptions;
    static init(databaseName: string): Promise<void>;
}
export declare const MongoGeoPoint: mongoose.Schema<Point, mongoose.Model<Point, any, any, any, mongoose.Document<unknown, any, Point, any, {}> & Point & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Point, mongoose.Document<unknown, {}, mongoose.FlatRecord<Point>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<Point> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
