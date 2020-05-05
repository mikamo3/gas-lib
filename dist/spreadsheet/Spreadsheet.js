"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var Log_1 = __importDefault(require("../Log"));
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
                Log_1.default.debug("create Spreadsheet id:" + id);
                this.spreadsheetCache[id] = spreadsheet;
            }
            else {
                Log_1.default.debug("cache exist id:" + id);
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
        Log_1.default.debug("target sheet:" + sheetname);
        var values = sheet.getDataRange().getValues();
        if (!values || (values.length === 1 && values[0].length === 1 && values[0][0] === "")) {
            return [];
        }
        Log_1.default.debug("value:");
        Log_1.default.debug(values);
        return values;
    };
    Spreadsheet.prototype.replace = function (sheetname, values, after) {
        if (after === void 0) { after = 0; }
        var sheet;
        Log_1.default.debug("sheetname:");
        Log_1.default.debug(sheetname);
        Log_1.default.debug("values:");
        Log_1.default.debug(values);
        try {
            sheet = this.spreadsheet.getSheetByName(sheetname);
        }
        catch (e) {
            throw new errors_1.SpreadsheetException(e);
        }
        var lastRow = sheet.getLastRow();
        Log_1.default.debug("lastRow:" + lastRow);
        if (lastRow !== 0 && lastRow > after) {
            var from = after + 1;
            var to = lastRow - after;
            Log_1.default.debug("delete rows " + from + "," + to);
            sheet.deleteRows(from, to);
        }
        if (!values || values.length === 0) {
            return;
        }
        if (after === 0) {
            sheet.insertRows(values.length);
        }
        else {
            sheet.insertRowsAfter(after, values.length);
        }
        var formattedValues = this.formatValues(values);
        Log_1.default.debug("insert range:" + (after + 1) + ",1," + formattedValues.length + "," + formattedValues[0].length);
        sheet
            .getRange(after + 1, 1, formattedValues.length, formattedValues[0].length)
            .setValues(formattedValues);
    };
    Spreadsheet.prototype.setSelectbox = function (sheetname, values, row, column, numRows, numColumns) {
        if (numRows === void 0) { numRows = 1; }
        if (numColumns === void 0) { numColumns = 1; }
        Log_1.default.debug("sheetname: " + sheetname + " values: [" + values.toString() + "] row: " + row + " column: " + column + " numRows: " + numRows + " numColumns: " + numColumns);
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
    Spreadsheet.prototype.add = function (sheetname, values) {
        Log_1.default.debug("sheetname: " + sheetname);
        Log_1.default.debug("values:");
        Log_1.default.debug(values);
        var sheet;
        try {
            sheet = this.spreadsheet.getSheetByName(sheetname);
        }
        catch (e) {
            throw new errors_1.SpreadsheetException(e);
        }
        if (values.length === 0) {
            return;
        }
        var formattedValues = this.formatValues(values);
        var lastRow = sheet.getLastRow();
        Log_1.default.debug("lastRow: " + lastRow);
        if (lastRow === 0) {
            sheet.insertRows(formattedValues.length);
        }
        else {
            sheet.insertRowsAfter(lastRow, formattedValues.length);
        }
        Log_1.default.debug("insert range:" + (lastRow + 1) + ",1," + formattedValues.length + "," + formattedValues[0].length);
        sheet
            .getRange(lastRow + 1, 1, formattedValues.length, formattedValues[0].length)
            .setValues(formattedValues);
    };
    Spreadsheet.prototype.formatValues = function (values) {
        var maxColumn = values.reduce(function (maxColumn, current) {
            return maxColumn < current.length ? current.length : maxColumn;
        }, 0);
        return values.map(function (v) {
            var filled = new Array(maxColumn);
            for (var i = 0; i < filled.length; i++) {
                filled[i] = i < v.length ? v[i] : "";
            }
            return filled;
        });
    };
    Spreadsheet.spreadsheetCache = {};
    return Spreadsheet;
}());
exports.Spreadsheet = Spreadsheet;
//# sourceMappingURL=Spreadsheet.js.map