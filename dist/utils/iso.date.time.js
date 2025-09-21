"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateFromNow = exports.toISODate = void 0;
var pad2 = function (p) {
    return p.toString().padStart(2, '0');
};
function toISODate(date, type) {
    if (type === 'yyyy-mm-dd') {
        return date.getFullYear()
            + '-' + pad2(date.getMonth() + 1)
            + '-' + pad2(date.getDate());
    }
    return date.getFullYear()
        + '-' + pad2(date.getMonth() + 1)
        + '-' + pad2(date.getDate())
        + ' ' + pad2(date.getHours())
        + ':' + pad2(date.getMinutes())
        + ':' + pad2(date.getSeconds());
}
exports.toISODate = toISODate;
function dateFromNow(func, date) {
    if (!date)
        date = new Date();
    func(date);
    return date;
}
exports.dateFromNow = dateFromNow;
