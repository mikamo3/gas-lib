"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spreadsheet_1 = require("./spreadsheet");
var testOpenById_1 = require("./test/testOpenById");
var testGetAllValues_1 = require("./test/testGetAllValues");
var testReplace_1 = require("./test/testReplace");
var testSetSelectbox_1 = require("./test/testSetSelectbox");
global.prepare = function () {
    var testFolderId = "1FdYqQOenb_Rn9jN6HvvAo1OjbxXHRmj4";
    var spreadSheetName = "Suppli_テスト";
    var testSpreadSheetId = PropertiesService.getScriptProperties().getProperty("testSpreadSheetId");
    if (testSpreadSheetId) {
        spreadsheet_1.deleteSpreadSheet(testSpreadSheetId);
        PropertiesService.getScriptProperties().setProperty("testSpreadSheetId", "");
    }
    var spreadsheetId = spreadsheet_1.createSpreadSheet(spreadSheetName, testFolderId);
    if (!spreadsheetId) {
        throw new Error("createFailed");
    }
    PropertiesService.getScriptProperties().setProperty("testSpreadSheetId", spreadsheetId);
};
global.runTest = function () {
    testOpenById_1.testOpenById();
    testGetAllValues_1.testGetAllValues();
    testReplace_1.testReplace();
    testSetSelectbox_1.testSetSelectbox();
};
//# sourceMappingURL=index.js.map