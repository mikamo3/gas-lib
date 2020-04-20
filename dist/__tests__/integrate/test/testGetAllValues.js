"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("src/index");
var common_1 = require("./common");
var spreadsheet_1 = require("../spreadsheet");
exports.testGetAllValues = function () {
    var testSpreadSheetId = PropertiesService.getScriptProperties().getProperty("testSpreadSheetId");
    if (!testSpreadSheetId) {
        throw new Error("spreadSheet does not exist");
    }
    var spreadsheet = index_1.Spreadsheet.openById(testSpreadSheetId);
    common_1.test("シートにデータがない場合", function () {
        var spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
        spreadsheet_1.setTestdata(spreadsheet, "hogehoge", []);
    }, function () {
        var actual = spreadsheet.getAllValues("hogehoge");
        common_1.assert("空配列が返却されること").toEqual(actual, []);
    });
    common_1.test("シートにデータがある場合", function () {
        var spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
        spreadsheet_1.setTestdata(spreadsheet, "hogehoge", [["foo"], ["bar", "baz"], ["hoge"]]);
    }, function () {
        var actual = spreadsheet.getAllValues("hogehoge");
        common_1.assert("データが返却されること").toEqual(actual, [
            ["foo", ""],
            ["bar", "baz"],
            ["hoge", ""]
        ]);
    });
};
//# sourceMappingURL=testGetAllValues.js.map