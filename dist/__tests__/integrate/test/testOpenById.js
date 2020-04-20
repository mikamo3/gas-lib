"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("src/index");
var common_1 = require("./common");
exports.testOpenById = function () {
    var testSpreadSheetId = PropertiesService.getScriptProperties().getProperty("testSpreadSheetId");
    if (!testSpreadSheetId) {
        throw new Error("spreadSheet does not exist");
    }
    common_1.test("openById", function () {
        //do nothing
    }, function () {
        index_1.Spreadsheet.openById(testSpreadSheetId);
    });
};
//# sourceMappingURL=testOpenById.js.map