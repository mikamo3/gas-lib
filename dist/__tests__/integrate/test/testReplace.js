"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("src/index");
var common_1 = require("./common");
var spreadsheet_1 = require("../spreadsheet");
exports.testReplace = function () {
    var testSpreadSheetId = PropertiesService.getScriptProperties().getProperty("testSpreadSheetId");
    if (!testSpreadSheetId) {
        throw new Error("spreadSheet does not exist");
    }
    var spreadsheet = index_1.Spreadsheet.openById(testSpreadSheetId);
    common_1.test("データがない場合", function () {
        var spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
        spreadsheet_1.setTestdata(spreadsheet, "hogehoge", [["foo", "bar"]]);
    }, function () {
        spreadsheet.replace("hogehoge", []);
        var actual = SpreadsheetApp.openById(testSpreadSheetId)
            .getSheetByName("hogehoge")
            .getDataRange()
            .getValues();
        common_1.assert("シートにデータが存在しないこと").toEqual(actual, [[""]]);
    });
    common_1.test("シートにデータがある場合", function () {
        var spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
        spreadsheet_1.setTestdata(spreadsheet, "hogehoge", [["foo", "bar"]]);
    }, function () {
        spreadsheet.replace("hogehoge", [["hoge"], ["hoge", "fuga"], ["piyo"]]);
        var actual = SpreadsheetApp.openById(testSpreadSheetId)
            .getSheetByName("hogehoge")
            .getDataRange()
            .getValues();
        common_1.assert("データが設定されること").toEqual(actual, [
            ["hoge", ""],
            ["hoge", "fuga"],
            ["piyo", ""]
        ]);
    });
    common_1.test("開始位置が指定された場合", function () {
        var spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
        spreadsheet_1.setTestdata(spreadsheet, "hogehoge", [["foo", "bar"]]);
    }, function () {
        spreadsheet.replace("hogehoge", [["hoge"], ["hoge", "fuga"], ["piyo"]], 1);
        var actual = SpreadsheetApp.openById(testSpreadSheetId)
            .getSheetByName("hogehoge")
            .getDataRange()
            .getValues();
        common_1.assert("データが設定されること").toEqual(actual, [
            ["foo", "bar"],
            ["hoge", ""],
            ["hoge", "fuga"],
            ["piyo", ""]
        ]);
    });
};
//# sourceMappingURL=testReplace.js.map