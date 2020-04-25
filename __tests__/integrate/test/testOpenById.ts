import { Spreadsheet, Test } from "src/index";
export const testOpenById = () => {
  const testSpreadSheetId = PropertiesService.getScriptProperties().getProperty(
    "testSpreadSheetId"
  );
  if (!testSpreadSheetId) {
    throw new Error("spreadSheet does not exist");
  }
  Test.run(
    "openById",
    () => {
      //do nothing
    },
    () => {
      Spreadsheet.openById(testSpreadSheetId);
    }
  );
};
