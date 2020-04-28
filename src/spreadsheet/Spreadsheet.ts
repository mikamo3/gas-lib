import { SpreadsheetAppException, SpreadsheetException } from "./errors";

export class Spreadsheet {
  static spreadsheetCache: { [P: string]: GoogleAppsScript.Spreadsheet.Spreadsheet } = {};
  private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
  private constructor(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
    this.spreadsheet = spreadsheet;
  }
  getSpreadsheet() {
    return this.spreadsheet;
  }
  static openById(id: string) {
    try {
      if (!this.spreadsheetCache[id]) {
        const spreadsheet = SpreadsheetApp.openById(id);
        this.spreadsheetCache[id] = spreadsheet;
      }
      return new Spreadsheet(this.spreadsheetCache[id]);
    } catch (e) {
      throw new SpreadsheetAppException(e);
    }
  }
  getAllValues(sheetname: string) {
    let sheet: GoogleAppsScript.Spreadsheet.Sheet;
    try {
      sheet = this.spreadsheet.getSheetByName(sheetname);
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
      sheet = this.spreadsheet.getSheetByName(sheetname);
    } catch (e) {
      throw new SpreadsheetException(e);
    }
    if (sheet.getLastRow() !== 0 && sheet.getLastRow() > after) {
      sheet.deleteRows(after + 1, sheet.getLastRow() - after);
    }
    if (!values || values.length === 0) {
      return;
    }
    const formattedValues = this.formatValues(values);
    if (after === 0) {
      sheet.insertRows(formattedValues.length);
    } else {
      sheet.insertRowsAfter(after, formattedValues.length);
    }
    sheet
      .getRange(after + 1, 1, formattedValues.length, formattedValues[0].length)
      .setValues(formattedValues);
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
    this.spreadsheet
      .getSheetByName(sheetname)
      .getRange(row, column, numRows, numColumns)
      .setDataValidation(rule);
  }
  insertSheet(name: string, regenerate = false) {
    //TODO: シートが1件かつすでに存在する場合に対応する
    const existSheet = this.spreadsheet.getSheetByName(name);
    if (!existSheet) {
      this.spreadsheet.insertSheet(name);
    } else if (regenerate) {
      this.spreadsheet.deleteSheet(existSheet);
      this.spreadsheet.insertSheet(name);
    }
  }
  add(sheetname: string, values: unknown[][]) {
    let sheet: GoogleAppsScript.Spreadsheet.Sheet;
    try {
      sheet = this.spreadsheet.getSheetByName(sheetname);
    } catch (e) {
      throw new SpreadsheetException(e);
    }
    if (values.length === 0) {
      return;
    }
    const formattedValues = this.formatValues(values);
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      sheet.insertRows(formattedValues.length);
    } else {
      sheet.insertRowsAfter(lastRow, formattedValues.length);
    }
    sheet
      .getRange(lastRow + 1, 1, formattedValues.length, formattedValues[0].length)
      .setValues(formattedValues);
  }
  private formatValues(values: unknown[][]) {
    const maxColumn = values.reduce<number>((maxColumn, current) => {
      return maxColumn < current.length ? current.length : maxColumn;
    }, 0);
    return values.map(v => {
      const filled = new Array(maxColumn);
      for (let i = 0; i < filled.length; i++) {
        filled[i] = i < v.length ? v[i] : "";
      }
      return filled;
    });
  }
}
