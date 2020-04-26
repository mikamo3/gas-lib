import { Spreadsheet, Test, assert, TestSpreadsheetHelper } from "src/index";

export const testInsertSheet = () => {
  const testSpreadSheetId = PropertiesService.getScriptProperties().getProperty(
    "testSpreadSheetId"
  );
  if (!testSpreadSheetId) {
    throw new Error("spreadSheet does not exist");
  }
  Test.run(
    "同じ名前のシートが存在しない場合",
    () => {
      const spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
      TestSpreadsheetHelper.deleteSheet(spreadsheet, "hogehoge");
    },
    () => {
      const spreadsheet = Spreadsheet.openById(testSpreadSheetId);
      spreadsheet.insertSheet("hogehoge");
      const actual = !!SpreadsheetApp.openById(testSpreadSheetId).getSheetByName("hogehoge");
      assert("シートが存在すること").toEqual(actual, true);
    }
  );
  Test.run(
    "同じ名前のシートが存在する場合でregenerate=trueの場合",
    () => {
      const spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
      TestSpreadsheetHelper.setTestdata(spreadsheet, "hogehoge", [["foo", "bar"]]);
    },
    () => {
      const spreadsheet = Spreadsheet.openById(testSpreadSheetId);
      spreadsheet.insertSheet("hogehoge", true);
      const actual = SpreadsheetApp.openById(testSpreadSheetId)
        .getSheetByName("hogehoge")
        .getDataRange()
        .getValues();
      assert("既存シートが削除され、作成されること").toEqual(actual, [[""]]);
    }
  );
  Test.run(
    "同じ名前のシートが存在する場合でregenerate=falseの場合",
    () => {
      const spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
      TestSpreadsheetHelper.setTestdata(spreadsheet, "hogehoge", [["foo", "bar"]]);
    },
    () => {
      const spreadsheet = Spreadsheet.openById(testSpreadSheetId);
      spreadsheet.insertSheet("hogehoge", false);
      const actual = SpreadsheetApp.openById(testSpreadSheetId)
        .getSheetByName("hogehoge")
        .getDataRange()
        .getValues();
      assert("既存シートが削除されないこと").toEqual(actual, [["foo", "bar"]]);
    }
  );
};
