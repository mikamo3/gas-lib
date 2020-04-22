"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("src/index");
var common_1 = require("./common");
var spreadsheet_1 = require("../spreadsheet");
exports.testSetSelectbox = function () {
    var testSpreadSheetId = PropertiesService.getScriptProperties().getProperty("testSpreadSheetId");
    if (!testSpreadSheetId) {
        throw new Error("spreadSheet does not exist");
    }
    var spreadsheet = index_1.Spreadsheet.openById(testSpreadSheetId);
    common_1.test("チェックボックスを設定", function () {
        var spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
        spreadsheet_1.setTestdata(spreadsheet, "hogehoge", []);
    }, function () {
        spreadsheet.setSelectbox("hogehoge", ["foo", "bar"], 1, 2, 3, 4);
        var expected = ["foo", "bar"];
        var actual = SpreadsheetApp.openById(testSpreadSheetId)
            .getSheetByName("hogehoge")
            .getRange(1, 2, 3, 4)
            .getDataValidations();
        var _loop_1 = function (x) {
            var _loop_2 = function (y) {
                var actualValidation = (function () {
                    return actual[x][y] ? actual[x][y].getCriteriaValues()[0] : null;
                })();
                common_1.assert(x + 1 + "," + (y + 1) + "\u306B\u30BB\u30EC\u30AF\u30C8\u30DC\u30C3\u30AF\u30B9\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u308B\u3053\u3068").toEqual(actualValidation, expected);
            };
            for (var y = 0; y < actual[x].length; y++) {
                _loop_2(y);
            }
        };
        for (var x = 0; x < actual.length; x++) {
            _loop_1(x);
        }
    });
};
//# sourceMappingURL=testSetSelectbox.js.map