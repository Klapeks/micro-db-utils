import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { toISODate } from "./iso.date.time";
import { DatabaseOptions } from "@klapeks/utils";
import { MicroSQL } from "../micro.sql";



export function addTimedWhere<T extends ObjectLiteral>(
    builder: SelectQueryBuilder<T>, dateAlias: string, from: Date, to?: Date
) {
    const expr = MicroSQL.timeExpressions(builder.connection.options.type);
    builder.andWhere(expr.date(dateAlias) + ' >= ' + expr.date(':from'), {
        from: toISODate(from, "yyyy-mm-dd")
    });
    if (to) builder.andWhere(expr.date(dateAlias) + ' <= ' + expr.date(':to'), {
        to: toISODate(to, "yyyy-mm-dd")
    });
    return builder;
}

/** @deprecated use MicroSQL.timeExpressions(dbType).dateFromToWhere(...) */
export function rawTimedWhere(dateAlias: string, from: Date, to?: Date) {
    return MicroSQL.timeExpressions('mysql').dateFromToWhere(dateAlias, from, to);
}