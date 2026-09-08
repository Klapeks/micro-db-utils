import mongoose from "mongoose";
import { EntitySchemaOptions } from "typeorm";
import { MicroColumnTypeObject } from "../sql/column.type.parser";
export type RequiredColumns<T> = Required<EntitySchemaOptions<T>['columns']>;
export type RequiredMongoColumns<T> = Required<mongoose.Schema<T>>;
export declare function createRelation(target: string, type: "one-to-many" | "one-to-one", inverseSide: string, cascade?: boolean): {
    target: string;
    type: "one-to-many" | "one-to-one";
    cascade: boolean;
    inverseSide: string;
};
export declare const MULTISQL_COLUMNS_TYPES: import("@klapeks/utils").IDatabaseColumnTypesList;
export declare const FloatingColumn: MicroColumnTypeObject;
export declare const NullableFloatingColumn: MicroColumnTypeObject;
export declare const Float64Column: MicroColumnTypeObject;
export declare const NullableFloat64Column: MicroColumnTypeObject;
