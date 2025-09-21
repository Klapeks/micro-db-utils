"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quietRequire = void 0;
function quietRequire(module) {
    try {
        return require(module);
    }
    catch (err) {
        return undefined;
    }
}
exports.quietRequire = quietRequire;
