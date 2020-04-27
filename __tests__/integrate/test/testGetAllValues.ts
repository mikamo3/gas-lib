import { Spreadsheet, TestSpreadsheetHelper, assert, Test } from "src/index";

export const testGetAllValues = () => {
  const testSpreadSheetId = PropertiesService.getScriptProperties().getProperty(
    "testSpreadSheetId"
  );
  if (!testSpreadSheetId) {
    throw new Error("spreadsheet does not exist");
  }
  const spreadsheet = Spreadsheet.openById(testSpreadSheetId);
  Test.run(
    "シートにデータがない場合",
    () => {
      TestSpreadsheetHelper.setTestdata(spreadsheet.getSpreadsheet(), "hogehoge", []);
    },
    () => {
      const actual = spreadsheet.getAllValues("hogehoge");
      assert("空配列が返却されること").toEqual(actual, []);
    }
  );
  Test.run(
    "シートにデータがある場合",
    () => {
      TestSpreadsheetHelper.setTestdata(spreadsheet.getSpreadsheet(), "hogehoge", [
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
