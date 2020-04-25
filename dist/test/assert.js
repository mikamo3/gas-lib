"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = require("underscore");
var AssertionError = /** @class */ (function (_super) {
    __extends(AssertionError, _super);
    function AssertionError(actual, expected) {
        var _this = _super.call(this) || this;
        Logger.log({ actual: actual, expected: expected });
        return _this;
    }
    return AssertionError;
}(Error));
exports.AssertionError = AssertionError;
exports.assert = function (message) {
    var logAssertMessage = function (m) {
        var msg = m;
        return function (assertOK) {
            if (assertOK === void 0) { assertOK = true; }
            var result = assertOK ? "OK" : "NG";
            Logger.log(msg + " : " + result);
        };
    };
    var log = logAssertMessage(message);
    return {
        toEqual: function (actual, expected) {
            if (!underscore_1.isEqual(actual, expected)) {
                log(false);
                throw new AssertionError(actual, expected);
            }
            log();
        },
        toMatchObject: function (actual, expected) {
            if (!underscore_1.isMatch(actual, expected)) {
                log(false);
                throw new AssertionError(actual, expected);
            }
            log();
        }
    };
};
//# sourceMappingURL=assert.js.map