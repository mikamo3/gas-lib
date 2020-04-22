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
  replace(sheetname: string, values: unknown[][], after = 0) {
    let sheet: GoogleAppsScript.Spreadsheet.Sheet;
    try {
      sheet = this.spreadSheet.getSheetByName(sheetname);
    } catch (e) {
      throw new SpreadsheetException(e);
    }
    if (sheet.getLastRow() !== 0 && sheet.getLastRow() > after) {
      sheet.deleteRows(after + 1, sheet.getLastRow() - after);
    }
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
    if (after === 0) {
      sheet.insertRows(formattedValues.length);
    } else {
      sheet.insertRowsAfter(after, formattedValues.length);
    }
    sheet.getRange(after + 1, 1, values.length, maxColumn).setValues(formattedValues);
  }
  setSelectbox(
    sheetname: string,
    values: string[],
    row: number,
    column: number,
    numRows = 1,
    numColumns = 1
  ) {
    const rule = SpreadsheetApp.newDataValidation().requireValueInList(values).build();
    this.spreadSheet
      .getSheetByName(sheetname)
      .getRange(row, column, numRows, numColumns)
      .setDataValidation(rule);
  }
}
