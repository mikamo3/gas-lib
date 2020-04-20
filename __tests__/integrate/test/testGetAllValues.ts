import { Spreadsheet } from "src/index";
import { test, assert } from "./common";
import { setTestdata } from "../spreadsheet";

export const testGetAllValues = () => {
  const testSpreadSheetId = PropertiesService.getScriptProperties().getProperty(
    "testSpreadSheetId"
  );
  if (!testSpreadSheetId) {
    throw new Error("spreadSheet does not exist");
  }
  const spreadsheet = Spreadsheet.openById(testSpreadSheetId);
  test(
    "シートにデータがない場合",
    () => {
      const spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
      setTestdata(spreadsheet, "hogehoge", []);
    },
    () => {
      const actual = spreadsheet.getAllValues("hogehoge");
      assert("空配列が返却されること").toEqual(actual, []);
    }
  );
  test(
    "シートにデータがある場合",
    () => {
      const spreadsheet = SpreadsheetApp.openById(testSpreadSheetId);
      setTestdata(spreadsheet, "hogehoge", [["foo"], ["bar", "baz"], ["hoge"]]);
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
