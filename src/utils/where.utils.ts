import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { toISODate } from "./iso.date.time";



export function addTimedWhere<T extends ObjectLiteral>(
    builder: SelectQueryBuilder<T>, dateAlias: string, from: Date, to?: Date
) {
    builder.where("date(" + dateAlias + ") >= date(:from)", { 
        from: toISODate(from, "yyyy-mm-dd")
    });
    if (to) builder.andWhere("date(" + dateAlias + ") <= date(:to)", {
        to: toISODate(to, "yyyy-mm-dd")
    });
    return builder;
}
export function rawTimedWhere(dateAlias: string, from: Date, to?: Date) {
    let sql = "date(" + dateAlias + ") >= date('" + toISODate(from, "yyyy-mm-dd") + "') ";
    if (to) sql += "AND date(" + dateAlias + ") <= date('" + toISODate(to, "yyyy-mm-dd") + "')";
    return sql;
}
