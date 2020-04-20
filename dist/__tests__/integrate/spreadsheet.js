"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSpreadSheet = function (testSpreadSheetId) {
    try {
        var folder = DriveApp.getFileById(testSpreadSheetId);
        folder.setTrashed(true);
    }
    catch (e) {
        Logger.log(e);
        Logger.log("skip remove exist test spreadsheet");
    }
    Logger.log("delete spreadSheet for test. id:" + testSpreadSheetId);
};
exports.createSpreadSheet = function (spreadSheetName, folderId) {
    var file = Drive.Files.insert({
        title: spreadSheetName,
        mimeType: "application/vnd.google-apps.spreadsheet",
        parents: [{ id: folderId }]
    });
    Logger.log("create spreadSheet for test. id:" + file.id);
    return file.id;
};
exports.setTestdata = function (spreadSheet, sheetName, values) {
    var appendValues = function (spreadSheet, sheetName, values) {
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
        var sheet = spreadSheet.setActiveSheet(spreadSheet.getSheetByName(sheetName));
        // eslint-disable-next-line prefer-spread
        sheet.getRange.apply(sheet, getRange(values)).setValues(getFormatValues(values));
    };
    var prepareSheet = function (spreadSheet, sheetName) {
        var sheet = spreadSheet.getSheetByName(sheetName);
        if (sheet) {
            spreadSheet.deleteSheet(sheet);
        }
        spreadSheet.insertSheet(sheetName);
    };
    prepareSheet(spreadSheet, sheetName);
    appendValues(spreadSheet, sheetName, values);
};
//# sourceMappingURL=spreadsheet.js.map