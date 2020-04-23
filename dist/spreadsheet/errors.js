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
var SpreadsheetAppException = /** @class */ (function (_super) {
    __extends(SpreadsheetAppException, _super);
    function SpreadsheetAppException(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        return _this;
    }
    return SpreadsheetAppException;
}(Error));
exports.SpreadsheetAppException = SpreadsheetAppException;
var SpreadsheetException = /** @class */ (function (_super) {
    __extends(SpreadsheetException, _super);
    function SpreadsheetException(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        return _this;
    }
    return SpreadsheetException;
}(Error));
exports.SpreadsheetException = SpreadsheetException;
//# sourceMappingURL=errors.js.map