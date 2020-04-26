type SheetValues = Array<Array<string | number>>;

const deleteSpreadSheet = (testSpreadSheetId: string) => {
  try {
    const folder = DriveApp.getFileById(testSpreadSheetId);
    folder.setTrashed(true);
  } catch (e) {
    Logger.log(e);
    Logger.log("skip remove exist test spreadsheet");
  }
  Logger.log(`delete spreadSheet for test. id:${testSpreadSheetId}`);
};

const createSpreadSheet = (spreadSheetName: string, folderId: string) => {
  const file = Drive.Files.insert({
    title: spreadSheetName,
    mimeType: "application/vnd.google-apps.spreadsheet",
    parents: [{ id: folderId }]
  });
  Logger.log(`create spreadSheet for test. id:${file.id}`);
  return file.id;
};

const setTestdata = (
  spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
  sheetName: string,
  values: SheetValues
) => {
  const appendValues = (
    spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    sheetName: string,
    values: SheetValues
  ) => {
    const getRowNum = (arr: SheetValues) => arr.length;
    const getColumnNum = (arr: SheetValues) =>
      arr.reduce<number>((column, a) => (column < a.length ? a.length : column), 0);

    const getRange = (values: SheetValues) => [1, 1, getRowNum(values), getColumnNum(values)];
    if (!values || values.length === 0) {
      return;
    }
    const getFormatValues = (values: SheetValues) => {
      return values.map(v => {
        const filled = new Array(getColumnNum(values));
        for (let i = 0; i < filled.length; i++) {
          filled[i] = i < v.length ? v[i] : "";
        }
        return filled;
      });
    };

    const sheet = spreadSheet.setActiveSheet(spreadSheet.getSheetByName(sheetName));
    // eslint-disable-next-line prefer-spread
    sheet.getRange.apply(sheet, getRange(values)).setValues(getFormatValues(values));
  };
  const prepareSheet = (
    spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    sheetName: string
  ) => {
    const sheet = spreadSheet.getSheetByName(sheetName);
    if (sheet) {
      spreadSheet.deleteSheet(sheet);
    }
    spreadSheet.insertSheet(sheetName);
  };
  prepareSheet(spreadSheet, sheetName);
  appendValues(spreadSheet, sheetName, values);
};

const deleteSheet = (spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet, sheetname: string) => {
  const sheet = spreadSheet.getSheetByName(sheetname);
  if (sheet) {
    spreadSheet.deleteSheet(sheet);
  }
};
export const TestSpreadsheetHelper = {
  setTestdata,
  deleteSpreadSheet,
  createSpreadSheet,
  deleteSheet
};
