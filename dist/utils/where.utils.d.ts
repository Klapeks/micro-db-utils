import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
export declare function addTimedWhere<T extends ObjectLiteral>(builder: SelectQueryBuilder<T>, dateAlias: string, from: Date, to?: Date): SelectQueryBuilder<T>;
/** @deprecated use MicroSQL.timeExpressions(dbType).dateFromToWhere(...) */
export declare function rawTimedWhere(dateAlias: string, from: Date, to?: Date): string;
