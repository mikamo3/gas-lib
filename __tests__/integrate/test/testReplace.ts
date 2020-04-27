import { Spreadsheet, Test, TestSpreadsheetHelper, assert } from "src/index";

export const testReplace = () => {
  const testSpreadSheetId = PropertiesService.getScriptProperties().getProperty(
    "testSpreadSheetId"
  );
  if (!testSpreadSheetId) {
    throw new Error("spreadsheet does not exist");
  }
  const spreadsheet = Spreadsheet.openById(testSpreadSheetId);
  Test.run(
    "データがない場合",
    () => {
      TestSpreadsheetHelper.setTestdata(spreadsheet.getSpreadsheet(), "hogehoge", [["foo", "bar"]]);
    },
    () => {
      spreadsheet.replace("hogehoge", []);
      const actual = SpreadsheetApp.openById(testSpreadSheetId)
        .getSheetByName("hogehoge")
        .getDataRange()
        .getValues();
      assert("シートにデータが存在しないこと").toEqual(actual, [[""]]);
    }
  );
  Test.run(
    "シートにデータがある場合",
    () => {
      TestSpreadsheetHelper.setTestdata(spreadsheet.getSpreadsheet(), "hogehoge", [["foo", "bar"]]);
    },
    () => {
      spreadsheet.replace("hogehoge", [["hoge"], ["hoge", "fuga"], ["piyo"]]);
      const actual = SpreadsheetApp.openById(testSpreadSheetId)
        .getSheetByName("hogehoge")
        .getDataRange()
        .getValues();
      assert("データが設定されること").toEqual(actual, [
        ["hoge", ""],
        ["hoge", "fuga"],
        ["piyo", ""]
      ]);
    }
  );
  Test.run(
    "開始位置が指定された場合",
    () => {
      TestSpreadsheetHelper.setTestdata(spreadsheet.getSpreadsheet(), "hogehoge", [["foo", "bar"]]);
    },
    () => {
      spreadsheet.replace("hogehoge", [["hoge"], ["hoge", "fuga"], ["piyo"]], 1);
      const actual = spreadsheet
        .getSpreadsheet()
        .getSheetByName("hogehoge")
        .getDataRange()
        .getValues();
      assert("データが設定されること").toEqual(actual, [
        ["foo", "bar"],
        ["hoge", ""],
        ["hoge", "fuga"],
        ["piyo", ""]
      ]);
    }
  );
};
