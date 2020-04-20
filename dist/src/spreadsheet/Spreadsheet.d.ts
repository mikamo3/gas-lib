export declare class Spreadsheet {
    private spreadSheet;
    private constructor();
    static openById(id: string): Spreadsheet;
    getAllValues(sheetname: string): any[][];
    replace(sheetname: string, values: unknown[][], after?: number): void;
}
