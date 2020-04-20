import { Spreadsheet } from "src/index";
import { test } from "./common";
export const testOpenById = () => {
  const testSpreadSheetId = PropertiesService.getScriptProperties().getProperty(
    "testSpreadSheetId"
  );
  if (!testSpreadSheetId) {
    throw new Error("spreadSheet does not exist");
  }
  test(
    "openById",
    () => {
      //do nothing
    },
    () => {
      Spreadsheet.openById(testSpreadSheetId);
    }
  );
};
