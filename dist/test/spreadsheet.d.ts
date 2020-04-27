/// <reference types="google-apps-script" />
declare type SheetValues = Array<Array<string | number>>;
export declare const TestSpreadsheetHelper: {
    setTestdata: (spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet, sheetName: string, values: SheetValues) => void;
    deleteSpreadSheet: (testSpreadSheetId: string) => void;
    createSpreadSheet: (spreadsheetName: string, folderId: string) => string;
    deleteSheet: (spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet, sheetname: string) => void;
};
export {};
