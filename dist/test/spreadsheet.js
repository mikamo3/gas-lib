"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deleteSpreadSheet = function (testSpreadSheetId) {
    try {
        var folder = DriveApp.getFileById(testSpreadSheetId);
        folder.setTrashed(true);
    }
    catch (e) {
        Logger.log(e);
        Logger.log("skip remove exist test spreadsheet");
    }
    Logger.log("delete spreadsheet for test. id:" + testSpreadSheetId);
};
var createSpreadSheet = function (spreadsheetName, folderId) {
    var file = Drive.Files.insert({
        title: spreadsheetName,
        mimeType: "application/vnd.google-apps.spreadsheet",
        parents: [{ id: folderId }]
    });
    Logger.log("create spreadsheet for test. id:" + file.id);
    return file.id;
};
var setTestdata = function (spreadsheet, sheetName, values) {
    var appendValues = function (spreadsheet, sheetName, values) {
        var getRowNum = function (arr) { return arr.length; };
        var getColumnNum = function (arr) {
            return arr.reduce(function (column, a) { return (column < a.length ? a.length : column); }, 0);
        };
        var getRange = function (values) { return [1, 1, getRowNum(values), getColumnNum(values)]; };
        if (!values || values.length === 0) {
            return;
        }
        var getFormatValues = function (values) {
            return values.map(function (v) {
                var filled = new Array(getColumnNum(values));
                for (var i = 0; i < filled.length; i++) {
                    filled[i] = i < v.length ? v[i] : "";
                }
                return filled;
            });
        };
        var sheet = spreadsheet.setActiveSheet(spreadsheet.getSheetByName(sheetName));
        // eslint-disable-next-line prefer-spread
        sheet.getRange.apply(sheet, getRange(values)).setValues(getFormatValues(values));
    };
    var prepareSheet = function (spreadsheet, sheetName) {
        var sheet = spreadsheet.getSheetByName(sheetName);
        if (sheet) {
            spreadsheet.deleteSheet(sheet);
        }
        spreadsheet.insertSheet(sheetName);
    };
    prepareSheet(spreadsheet, sheetName);
    appendValues(spreadsheet, sheetName, values);
};
var deleteSheet = function (spreadsheet, sheetname) {
    var sheet = spreadsheet.getSheetByName(sheetname);
    if (sheet) {
        spreadsheet.deleteSheet(sheet);
    }
};
exports.TestSpreadsheetHelper = {
    setTestdata: setTestdata,
    deleteSpreadSheet: deleteSpreadSheet,
    createSpreadSheet: createSpreadSheet,
    deleteSheet: deleteSheet
};
//# sourceMappingURL=spreadsheet.js.map