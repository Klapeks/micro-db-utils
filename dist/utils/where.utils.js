"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawTimedWhere = exports.addTimedWhere = void 0;
var iso_date_time_1 = require("./iso.date.time");
var micro_sql_1 = require("../micro.sql");
function addTimedWhere(builder, dateAlias, from, to) {
    var expr = micro_sql_1.MicroSQL.timeExpressions(builder.connection.options.type);
    builder.andWhere(expr.date(dateAlias) + ' >= ' + expr.date(':from'), {
        from: (0, iso_date_time_1.toISODate)(from, "yyyy-mm-dd")
    });
    if (to)
        builder.andWhere(expr.date(dateAlias) + ' <= ' + expr.date(':to'), {
            to: (0, iso_date_time_1.toISODate)(to, "yyyy-mm-dd")
        });
    return builder;
}
exports.addTimedWhere = addTimedWhere;
/** @deprecated use MicroSQL.timeExpressions(dbType).dateFromToWhere(...) */
function rawTimedWhere(dateAlias, from, to) {
    return micro_sql_1.MicroSQL.timeExpressions('mysql').dateFromToWhere(dateAlias, from, to);
}
exports.rawTimedWhere = rawTimedWhere;
