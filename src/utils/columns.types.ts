import mongoose from "mongoose";
import { EntitySchemaColumnOptions, EntitySchemaOptions } from "typeorm";


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


export const FloatingColumn: EntitySchemaColumnOptions = {
    type: "float", default: 0
    // type: "decimal", precision: 10, scale: 6, default: 0
}
export const NullableFloatingColumn = { 
    ...FloatingColumn, default: null, nullable: true 
};

export const Float64Column: EntitySchemaColumnOptions = {
    type: "double", default: 0
    // type: "decimal", precision: 10, scale: 6, default: 0
}
export const NullableFloat64Column = { 
    ...Float64Column, default: null, nullable: true 
};
