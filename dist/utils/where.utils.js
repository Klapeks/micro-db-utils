"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawTimedWhere = exports.addTimedWhere = void 0;
var iso_date_time_1 = require("./iso.date.time");
function addTimedWhere(builder, dateAlias, from, to) {
    builder.where("date(" + dateAlias + ") >= date(:from)", {
        from: (0, iso_date_time_1.toISODate)(from, "yyyy-mm-dd")
    });
    if (to)
        builder.andWhere("date(" + dateAlias + ") <= date(:to)", {
            to: (0, iso_date_time_1.toISODate)(to, "yyyy-mm-dd")
        });
    return builder;
}
exports.addTimedWhere = addTimedWhere;
function rawTimedWhere(dateAlias, from, to) {
    var sql = "date(" + dateAlias + ") >= date('" + (0, iso_date_time_1.toISODate)(from, "yyyy-mm-dd") + "') ";
    if (to)
        sql += "AND date(" + dateAlias + ") <= date('" + (0, iso_date_time_1.toISODate)(to, "yyyy-mm-dd") + "')";
    return sql;
}
exports.rawTimedWhere = rawTimedWhere;
