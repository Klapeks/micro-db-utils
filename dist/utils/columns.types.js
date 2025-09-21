"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullableFloat64Column = exports.Float64Column = exports.NullableFloatingColumn = exports.FloatingColumn = exports.createRelation = void 0;
function createRelation(target, type, inverseSide, cascade) {
    if (cascade === void 0) { cascade = true; }
    return { target: target, type: type, cascade: cascade, inverseSide: inverseSide };
}
exports.createRelation = createRelation;
exports.FloatingColumn = {
    type: "float", default: 0
    // type: "decimal", precision: 10, scale: 6, default: 0
};
exports.NullableFloatingColumn = __assign(__assign({}, exports.FloatingColumn), { default: null, nullable: true });
exports.Float64Column = {
    type: "double", default: 0
    // type: "decimal", precision: 10, scale: 6, default: 0
};
exports.NullableFloat64Column = __assign(__assign({}, exports.Float64Column), { default: null, nullable: true });
