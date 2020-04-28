import { Spreadsheet, Test, TestSpreadsheetHelper, assert } from "src/index";

export const testAdd = () => {
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
      spreadsheet.add("hogehoge", [["foo", "bar", "baz"]]);
      const actual = spreadsheet.getAllValues("hogehoge");
      assert("データが追加されること").toEqual(actual, [["foo", "bar", "baz"]]);
    }
  );
  Test.run(
    "シートにデータがある場合",
    () => {
      TestSpreadsheetHelper.setTestdata(spreadsheet.getSpreadsheet(), "hogehoge", [["foo"]]);
    },
    () => {
      spreadsheet.add("hogehoge", [["foo", "bar", "baz"]]);
      const actual = spreadsheet.getAllValues("hogehoge");
      assert("データが追加されること").toEqual(actual, [
        ["foo", "", ""],
        ["foo", "bar", "baz"]
      ]);
    }
  );
};
