import { Spreadsheet } from "src/index";
import { test, assert } from "./common";
import { setTestdata } from "../spreadsheet";

export const testReplace = () => {
  const testSpreadSheetId = PropertiesService.getScriptProperties().getProperty(
    "testSpreadSheetId"
  );
  if (!testSpreadSheetId) {
    throw new Error("spreadSheet does not exist");
  }
  const spreadsheet = Spreadsheet.openById(testSpreadSheetId);
  test(
    "データがない場合",
    () => {
      const spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
      setTestdata(spreadsheet, "hogehoge", [["foo", "bar"]]);
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
  test(
    "シートにデータがある場合",
    () => {
      const spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
      setTestdata(spreadsheet, "hogehoge", [["foo", "bar"]]);
    },
    () => {
      spreadsheet.replace("hogehoge", [["hoge"], ["hoge", "fuga"], ["piyo"]]);
      const actual = SpreadsheetApp.openById(testSpreadSheetId)
        .getSheetByName("hogehoge")
        .getDataRange()
        .getValues();
      assert("データが返却されること").toEqual(actual, [
        ["hoge", ""],
        ["hoge", "fuga"],
        ["piyo", ""]
      ]);
    }
  );
};
