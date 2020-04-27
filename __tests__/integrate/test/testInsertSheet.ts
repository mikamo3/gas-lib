import { Spreadsheet, Test, assert, TestSpreadsheetHelper } from "src/index";

export const testInsertSheet = () => {
  const testSpreadSheetId = PropertiesService.getScriptProperties().getProperty(
    "testSpreadSheetId"
  );
  if (!testSpreadSheetId) {
    throw new Error("spreadsheet does not exist");
  }
  const spreadsheet = Spreadsheet.openById(testSpreadSheetId);
  Test.run(
    "同じ名前のシートが存在しない場合",
    () => {
      TestSpreadsheetHelper.deleteSheet(spreadsheet.getSpreadsheet(), "hogehoge");
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
      TestSpreadsheetHelper.setTestdata(spreadsheet.getSpreadsheet(), "hogehoge", [["foo", "bar"]]);
    },
    () => {
      spreadsheet.insertSheet("hogehoge", true);
      const actual = spreadsheet
        .getSpreadsheet()
        .getSheetByName("hogehoge")
        .getDataRange()
        .getValues();
      assert("既存シートが削除され、作成されること").toEqual(actual, [[""]]);
    }
  );
  Test.run(
    "同じ名前のシートが存在する場合でregenerate=falseの場合",
    () => {
      TestSpreadsheetHelper.setTestdata(spreadsheet.getSpreadsheet(), "hogehoge", [["foo", "bar"]]);
    },
    () => {
      spreadsheet.insertSheet("hogehoge", false);
      const actual = spreadsheet
        .getSpreadsheet()
        .getSheetByName("hogehoge")
        .getDataRange()
        .getValues();
      assert("既存シートが削除されないこと").toEqual(actual, [["foo", "bar"]]);
    }
  );
};
