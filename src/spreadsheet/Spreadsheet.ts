import { SpreadsheetAppException, SpreadsheetException } from "./errors";

export class Spreadsheet {
  private spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
  private constructor(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
    this.spreadSheet = spreadsheet;
  }
  static openById(id: string) {
    try {
      const spreadsheet = SpreadsheetApp.openById(id);
      return new Spreadsheet(spreadsheet);
    } catch (e) {
      throw new SpreadsheetAppException(e);
    }
  }
  getAllValues(sheetname: string) {
    let sheet: GoogleAppsScript.Spreadsheet.Sheet;
    try {
      sheet = this.spreadSheet.getSheetByName(sheetname);
    } catch (e) {
      throw new SpreadsheetException(e);
    }
    const values = sheet.getDataRange().getValues();
    if (!values || (values.length === 1 && values[0].length === 1 && values[0][0] === "")) {
      return [];
    }
    return values;
  }
  replace(sheetname: string, values: unknown[][]) {
    let sheet: GoogleAppsScript.Spreadsheet.Sheet;
    try {
      sheet = this.spreadSheet.getSheetByName(sheetname);
    } catch (e) {
      throw new SpreadsheetException(e);
    }
    sheet.clear();
    if (!values || values.length === 0) {
      return;
    }
    const maxColumn = values.reduce<number>((maxColumn, current) => {
      return maxColumn < current.length ? current.length : maxColumn;
    }, 0);
    const formattedValues = values.map(v => {
      const filled = new Array(maxColumn);
      for (let i = 0; i < filled.length; i++) {
        filled[i] = i < v.length ? v[i] : "";
      }
      return filled;
    });
    sheet.getRange(1, 1, values.length, maxColumn).setValues(formattedValues);
  }
}
