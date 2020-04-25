import { Spreadsheet, Test, TestSpreadsheetHelper, assert } from "src/index";

export const testSetSelectbox = () => {
  const testSpreadSheetId = PropertiesService.getScriptProperties().getProperty(
    "testSpreadSheetId"
  );
  if (!testSpreadSheetId) {
    throw new Error("spreadSheet does not exist");
  }
  const spreadsheet = Spreadsheet.openById(testSpreadSheetId);
  Test.run(
    "チェックボックスを設定",
    () => {
      const spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
      TestSpreadsheetHelper.setTestdata(spreadsheet, "hogehoge", []);
    },
    () => {
      spreadsheet.setSelectbox("hogehoge", ["foo", "bar"], 1, 2, 3, 4);
      const expected = ["foo", "bar"];
      const actual = SpreadsheetApp.openById(testSpreadSheetId)
        .getSheetByName("hogehoge")
        .getRange(1, 2, 3, 4)
        .getDataValidations();
      for (let x = 0; x < actual.length; x++) {
        for (let y = 0; y < actual[x].length; y++) {
          const actualValidation = (() => {
            return actual[x][y] ? actual[x][y].getCriteriaValues()[0] : null;
          })();
          assert(`${x + 1},${y + 1}にセレクトボックスが設定されていること`).toEqual(
            actualValidation,
            expected
          );
        }
      }
    }
  );
};
