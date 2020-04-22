import { deleteSpreadSheet, createSpreadSheet } from "./spreadsheet";
import { testOpenById } from "./test/testOpenById";
import { testGetAllValues } from "./test/testGetAllValues";
import { testReplace } from "./test/testReplace";
import { testSetSelectbox } from "./test/testSetSelectbox";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any;
global.prepare = () => {
  const testFolderId = "1FdYqQOenb_Rn9jN6HvvAo1OjbxXHRmj4";
  const spreadSheetName = "Suppli_テスト";
  const testSpreadSheetId = PropertiesService.getScriptProperties().getProperty(
    "testSpreadSheetId"
  );
  if (testSpreadSheetId) {
    deleteSpreadSheet(testSpreadSheetId);
    PropertiesService.getScriptProperties().setProperty("testSpreadSheetId", "");
  }
  const spreadsheetId = createSpreadSheet(spreadSheetName, testFolderId);
  if (!spreadsheetId) {
    throw new Error("createFailed");
  }
  PropertiesService.getScriptProperties().setProperty("testSpreadSheetId", spreadsheetId);
};
global.runTest = () => {
  testOpenById();
  testGetAllValues();
  testReplace();
  testSetSelectbox();
};
