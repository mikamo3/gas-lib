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
      assert("データが設定されること").toEqual(actual, [
        ["hoge", ""],
        ["hoge", "fuga"],
        ["piyo", ""]
      ]);
    }
  );
  test(
    "開始位置が指定された場合",
    () => {
      const spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
      setTestdata(spreadsheet, "hogehoge", [["foo", "bar"]]);
    },
    () => {
      spreadsheet.replace("hogehoge", [["hoge"], ["hoge", "fuga"], ["piyo"]], 1);
      const actual = SpreadsheetApp.openById(testSpreadSheetId)
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
