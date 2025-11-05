/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { DatabaseOptions, Flatten } from "@klapeks/utils";
import type { Schema as MongooseSchema, PipelineStage, QuerySelector } from "mongoose";
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
        readonly model: any;
        readonly increment: (model: T, increment?: number) => Promise<any>;
        readonly set: (model: T, value: number) => Promise<any>;
    };
    static getOptions(): MongoDBConnectOptions;
    static init(databaseName: string, replicaSet?: string): Promise<void>;
}
export declare const MongoGeoPoint: MongooseSchema<Point, import("mongoose").Model<Point, any, any, any, import("mongoose").Document<unknown, any, Point, any> & Point & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Point, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Point>, {}> & import("mongoose").FlatRecord<Point> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
