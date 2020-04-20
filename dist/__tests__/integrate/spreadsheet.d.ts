/// <reference types="google-apps-script" />
declare type SheetValues = Array<Array<string | number>>;
export declare const deleteSpreadSheet: (testSpreadSheetId: string) => void;
export declare const createSpreadSheet: (spreadSheetName: string, folderId: string) => string;
export declare const setTestdata: (spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet, sheetName: string, values: SheetValues) => void;
export {};
