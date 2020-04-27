/// <reference types="google-apps-script" />
export declare class Spreadsheet {
    static spreadsheetCache: {
        [P: string]: GoogleAppsScript.Spreadsheet.Spreadsheet;
    };
    private spreadsheet;
    private constructor();
    getSpreadsheet(): GoogleAppsScript.Spreadsheet.Spreadsheet;
    static openById(id: string): Spreadsheet;
    getAllValues(sheetname: string): any[][];
    replace(sheetname: string, values: unknown[][], after?: number): void;
    setSelectbox(sheetname: string, values: string[], row: number, column: number, numRows?: number, numColumns?: number): void;
    insertSheet(name: string, regenerate?: boolean): void;
}
