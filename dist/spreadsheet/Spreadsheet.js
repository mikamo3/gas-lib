"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var Spreadsheet = /** @class */ (function () {
    function Spreadsheet(spreadsheet) {
        this.spreadsheet = spreadsheet;
    }
    Spreadsheet.prototype.getSpreadsheet = function () {
        return this.spreadsheet;
    };
    Spreadsheet.openById = function (id) {
        try {
            if (!this.spreadsheetCache[id]) {
                var spreadsheet = SpreadsheetApp.openById(id);
                this.spreadsheetCache[id] = spreadsheet;
            }
            return new Spreadsheet(this.spreadsheetCache[id]);
        }
        catch (e) {
            throw new errors_1.SpreadsheetAppException(e);
        }
    };
    Spreadsheet.prototype.getAllValues = function (sheetname) {
        var sheet;
        try {
            sheet = this.spreadsheet.getSheetByName(sheetname);
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
            sheet = this.spreadsheet.getSheetByName(sheetname);
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
    Spreadsheet.prototype.setSelectbox = function (sheetname, values, row, column, numRows, numColumns) {
        if (numRows === void 0) { numRows = 1; }
        if (numColumns === void 0) { numColumns = 1; }
        var rule = SpreadsheetApp.newDataValidation().requireValueInList(values).build();
        this.spreadsheet
            .getSheetByName(sheetname)
            .getRange(row, column, numRows, numColumns)
            .setDataValidation(rule);
    };
    Spreadsheet.prototype.insertSheet = function (name, regenerate) {
        if (regenerate === void 0) { regenerate = false; }
        //TODO: シートが1件かつすでに存在する場合に対応する
        var existSheet = this.spreadsheet.getSheetByName(name);
        if (!existSheet) {
            this.spreadsheet.insertSheet(name);
        }
        else if (regenerate) {
            this.spreadsheet.deleteSheet(existSheet);
            this.spreadsheet.insertSheet(name);
        }
    };
    Spreadsheet.spreadsheetCache = {};
    return Spreadsheet;
}());
exports.Spreadsheet = Spreadsheet;
//# sourceMappingURL=Spreadsheet.js.map