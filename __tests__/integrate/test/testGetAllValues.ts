import { Spreadsheet, TestSpreadsheetHelper, assert, Test } from "src/index";

export const testGetAllValues = () => {
  const testSpreadSheetId = PropertiesService.getScriptProperties().getProperty(
    "testSpreadSheetId"
  );
  if (!testSpreadSheetId) {
    throw new Error("spreadSheet does not exist");
  }
  const spreadsheet = Spreadsheet.openById(testSpreadSheetId);
  Test.run(
    "シートにデータがない場合",
    () => {
      const spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
      TestSpreadsheetHelper.setTestdata(spreadsheet, "hogehoge", []);
    },
    () => {
      const actual = spreadsheet.getAllValues("hogehoge");
      assert("空配列が返却されること").toEqual(actual, []);
    }
  );
  Test.run(
    "シートにデータがある場合",
    () => {
      const spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
      TestSpreadsheetHelper.setTestdata(spreadsheet, "hogehoge", [
        ["foo"],
        ["bar", "baz"],
        ["hoge"]
      ]);
    },
    () => {
      const actual = spreadsheet.getAllValues("hogehoge");
      assert("データが返却されること").toEqual(actual, [
        ["foo", ""],
        ["bar", "baz"],
        ["hoge", ""]
      ]);
    }
  );
};
