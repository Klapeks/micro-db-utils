import { getDatabaseColumnTypes } from "@klapeks/utils";
import mongoose from "mongoose";
import { EntitySchemaOptions } from "typeorm";
import { MicroColumnTypeObject } from "../sql/column.type.parser";


export type RequiredColumns<T> = Required<EntitySchemaOptions<T>['columns']>;
export type RequiredMongoColumns<T> = Required<mongoose.Schema<T>>;

export function createRelation(
    target: string,
    type: "one-to-many" | "one-to-one",
    inverseSide: string,
    cascade = true
) {
    return { target, type, cascade, inverseSide }
}

export const MULTISQL_COLUMNS_TYPES = getDatabaseColumnTypes();

export const FloatingColumn: MicroColumnTypeObject = {
    type: MULTISQL_COLUMNS_TYPES.float32, default: 0
    // type: "decimal", precision: 10, scale: 6, default: 0
}
export const NullableFloatingColumn: MicroColumnTypeObject = { 
    ...FloatingColumn, default: null, nullable: true 
};

export const Float64Column: MicroColumnTypeObject = {
    type: MULTISQL_COLUMNS_TYPES.float64, default: 0
    // type: "decimal", precision: 10, scale: 6, default: 0
}
export const NullableFloat64Column: MicroColumnTypeObject = { 
    ...Float64Column, default: null, nullable: true 
};
