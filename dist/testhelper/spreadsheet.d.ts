/// <reference types="google-apps-script" />
declare type SheetValues = Array<Array<string | number>>;
export declare const TestSpreadsheetHelper: {
    setTestdata: (spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet, sheetName: string, values: SheetValues) => void;
    deleteSpreadSheet: (testSpreadSheetId: string) => void;
    createSpreadSheet: (spreadSheetName: string, folderId: string) => string;
};
export {};
