"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var Spreadsheet = /** @class */ (function () {
    function Spreadsheet(spreadsheet) {
        this.spreadSheet = spreadsheet;
    }
    Spreadsheet.openById = function (id) {
        try {
            var spreadsheet = SpreadsheetApp.openById(id);
            return new Spreadsheet(spreadsheet);
        }
        catch (e) {
            throw new errors_1.SpreadsheetAppException(e);
        }
    };
    Spreadsheet.prototype.getAllValues = function (sheetname) {
        var sheet;
        try {
            sheet = this.spreadSheet.getSheetByName(sheetname);
        }
        catch (e) {
            throw new errors_1.SpreadsheetException(e);
        }
        var values = sheet.getDataRange().getValues();
        if (!values || (values.length === 1 && values[0].length === 1 && values[0][0] === "")) {
            return [];
        }
        return values;
    };
    Spreadsheet.prototype.replace = function (sheetname, values, after) {
        if (after === void 0) { after = 0; }
        var sheet;
        try {
            sheet = this.spreadSheet.getSheetByName(sheetname);
        }
        catch (e) {
            throw new errors_1.SpreadsheetException(e);
        }
        if (sheet.getLastRow() !== 0 && sheet.getLastRow() > after) {
            sheet.deleteRows(after + 1, sheet.getLastRow() - after);
        }
        if (!values || values.length === 0) {
            return;
        }
        var maxColumn = values.reduce(function (maxColumn, current) {
            return maxColumn < current.length ? current.length : maxColumn;
        }, 0);
        var formattedValues = values.map(function (v) {
            var filled = new Array(maxColumn);
            for (var i = 0; i < filled.length; i++) {
                filled[i] = i < v.length ? v[i] : "";
            }
            return filled;
        });
        if (after === 0) {
            sheet.insertRows(formattedValues.length);
        }
        else {
            sheet.insertRowsAfter(after, formattedValues.length);
        }
        sheet.getRange(after + 1, 1, values.length, maxColumn).setValues(formattedValues);
    };
    return Spreadsheet;
}());
exports.Spreadsheet = Spreadsheet;
//# sourceMappingURL=Spreadsheet.js.map