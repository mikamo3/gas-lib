import { testOpenById } from "./test/testOpenById";
import { testGetAllValues } from "./test/testGetAllValues";
import { testReplace } from "./test/testReplace";
import { testSetSelectbox } from "./test/testSetSelectbox";
import { TestSpreadsheetHelper } from "src/index";
import { testInsertSheet } from "./test/testInsertSheet";
import { testAdd } from "./test/testAdd";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any;
const prepareSpreadsheet = () => {
  const testFolderId = "1FdYqQOenb_Rn9jN6HvvAo1OjbxXHRmj4";
  const spreadsheetName = "spreadsheet_テスト";
  const testSpreadSheetId = PropertiesService.getScriptProperties().getProperty(
    "testSpreadSheetId"
  );
  if (testSpreadSheetId) {
    TestSpreadsheetHelper.deleteSpreadSheet(testSpreadSheetId);
    PropertiesService.getScriptProperties().setProperty("testSpreadSheetId", "");
  }
  const spreadsheetId = TestSpreadsheetHelper.createSpreadSheet(spreadsheetName, testFolderId);
  if (!spreadsheetId) {
    throw new Error("createFailed");
  }
  PropertiesService.getScriptProperties().setProperty("testSpreadSheetId", spreadsheetId);
};
global.runTest = () => {
  prepareSpreadsheet();
  testOpenById();
  testGetAllValues();
  testReplace();
  testSetSelectbox();
  testInsertSheet();
  testAdd();
};
global.testOpenById = testOpenById;
global.testGetAllValues = testGetAllValues;
global.testReplace = testReplace;
global.testSetSelectbox = testSetSelectbox;
global.testInsertSheet = testInsertSheet;
global.testAdd = testAdd;
