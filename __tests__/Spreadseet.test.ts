import { SpreadsheetAppException, SpreadsheetException } from "src/spreadsheet/errors";
import { Spreadsheet } from "src/spreadsheet/Spreadsheet";
import { mocked } from "ts-jest/utils";

const openById = jest.fn();
const getSheetByName = jest.fn();
const getDataRange = jest.fn();
const getRange = jest.fn();
const getValues = jest.fn();
const setValues = jest.fn();
const deleteRows = jest.fn();
const getLastRow = jest.fn();
const insertRowsAfter = jest.fn();
const insertRows = jest.fn();
const newDataValidation = jest.fn();
const requireValueInList = jest.fn();
const build = jest.fn();
const setDataValidation = jest.fn();
const insertSheet = jest.fn();
const deleteSheet = jest.fn();
const mockedSpreadSheet: Partial<
  { [s in keyof GoogleAppsScript.Spreadsheet.Spreadsheet]: unknown }
> = {
  getSheetByName,
  insertSheet,
  deleteSheet
};

const mockedSheet: Partial<{ [s in keyof GoogleAppsScript.Spreadsheet.Sheet]: unknown }> = {
  getRange,
  getDataRange,
  deleteRows,
  getLastRow,
  insertRowsAfter,
  insertRows
};
const mockedRange: Partial<{ [s in keyof GoogleAppsScript.Spreadsheet.Range]: unknown }> = {
  getValues,
  setValues,
  setDataValidation
};
const getValuesRVB = [[]];
let getValuesRV: unknown[][];
const getLastRowRVB = 0;
let getLastRowRV: number;
const buildRVB = [];
let buildRV: unknown[];

const getSheetByNameRVB = mockedSheet;
let getSheetByNameRV: Partial<{ [s in keyof GoogleAppsScript.Spreadsheet.Sheet]: unknown }>;

SpreadsheetApp.openById = openById;
SpreadsheetApp.newDataValidation = newDataValidation;

beforeAll(() => {
  getLastRowRV = getLastRowRVB;
  getValuesRV = getValuesRVB;
  buildRV = buildRVB;
  getSheetByNameRV = getSheetByNameRVB;
});
beforeEach(() => {
  openById.mockReturnValue(mockedSpreadSheet);
  getSheetByName.mockReturnValue(getSheetByNameRV);
  getDataRange.mockReturnValue(mockedRange);
  getRange.mockReturnValue(mockedRange);
  getValues.mockReturnValue(getValuesRV);
  getLastRow.mockReturnValue(getLastRowRV);
  newDataValidation.mockReturnValue({ requireValueInList });
  requireValueInList.mockReturnValue({ build });
  build.mockReturnValue(buildRV);
  Spreadsheet.spreadsheetCache = {};
});

afterEach(() => {
  jest.resetAllMocks();
});
describe("Spreadsheet", () => {
  describe("openById", () => {
    const id = "hogehoge";
    let spreadsheet: Spreadsheet;
    afterEach(() => {
      spreadsheet = undefined;
    });
    const runOpenById = () => {
      spreadsheet = Spreadsheet.openById(id);
    };
    describe("実行時", () => {
      beforeEach(() => {
        runOpenById();
      });
      it("SpreadsheetApp.openByIdが指定した引数で呼び出されること", () => {
        expect(SpreadsheetApp.openById).toBeCalledWith("hogehoge");
      });
    });
    describe("SpreadsheetApp.openByIdが例外を出した場合", () => {
      beforeEach(() => {
        openById.mockImplementation(() => {
          throw "error";
        });
      });
      it("SpreadSheetAppExceptionが発生すること", () => {
        expect(runOpenById).toThrowError(new SpreadsheetAppException("error"));
      });
    });
    describe("SpreadSheetApp.openByIdが例外を出さなかった場合", () => {
      beforeEach(() => {
        runOpenById();
      });
      it("SpreadSheetのインスタンスが返却されること", () => {
        expect(spreadsheet).toBeInstanceOf(Spreadsheet);
      });
    });
  });
  describe("getAllValues", () => {
    let actual;
    afterEach(() => {
      actual = undefined;
    });
    const runGetAllValues = () => {
      const spreadsheet = Spreadsheet.openById("hogehoge");
      actual = spreadsheet.getAllValues("sheet");
    };
    describe("Spreadsheet.getSheetByNameが例外を出した場合", () => {
      beforeEach(() => {
        mocked(getSheetByName).mockImplementation(() => {
          throw "error";
        });
      });
      it("SpreadsheetExceptionが発生すること", () => {
        expect(runGetAllValues).toThrowError(new SpreadsheetException("error"));
      });
    });
    describe("Spreadsheet.getSheetByNameが例外を出さなかった場合", () => {
      beforeEach(() => {
        runGetAllValues();
      });
      it("Sheet.getDataRangeが呼び出されること", () => {
        expect(getDataRange).toBeCalled();
      });
      it("Range.getValuesが呼び出されること", () => {
        expect(getValues).toBeCalled();
      });
    });
    describe("セルにデータが存在しない場合", () => {
      beforeAll(() => {
        getValuesRV = [[""]];
      });
      beforeEach(() => {
        runGetAllValues();
      });
      it("空配列が返却されること", () => {
        expect(actual).toEqual([]);
      });
    });
    describe("セルにデータが存在する場合", () => {
      beforeAll(() => {
        getValuesRV = [
          ["foo", "bar"],
          ["bar", "baz"]
        ];
      });
      beforeEach(() => {
        runGetAllValues();
      });
      it("getValuesの結果が返却されること", () => {
        expect(actual).toEqual(getValuesRV);
      });
    });
  });
  describe("replace", () => {
    let values: unknown[][];
    let after = 1;
    beforeEach(() => {
      const spreadsheet = Spreadsheet.openById("hogehoge");
      spreadsheet.replace("sheet", values, after);
    });
    describe("undefinedが渡された場合", () => {
      beforeAll(() => {
        values = undefined;
      });
      it("Sheet.getRangeが呼び出されないこと", () => {
        expect(getRange).not.toBeCalled();
      });
    });
    describe("afterに0が指定されている場合", () => {
      beforeAll(() => {
        after = 0;
      });
      describe("シートにデータが存在しない場合", () => {
        beforeAll(() => {
          getLastRowRV = 0;
        });
        it("Sheet.deleteRowsが呼ばれないこと", () => {
          expect(deleteRows).not.toBeCalled();
        });
      });
      describe("シートにデータが存在する場合", () => {
        beforeAll(() => {
          getLastRowRV = 5;
        });
        it("Sheet.deleteRowsが呼ばれること", () => {
          expect(deleteRows).toBeCalledWith(1, 5);
        });
      });
      describe("空配列が渡された場合", () => {
        beforeAll(() => {
          values = [];
        });
        it("Sheet.setValuesが呼び出されないこと", () => {
          expect(setValues).not.toBeCalled();
        });
      });
      describe("値の存在する配列が渡された場合", () => {
        beforeAll(() => {
          values = [
            ["foo", "bar"],
            ["bar", "baz"],
            ["hoge", "fuga", "piyo", "hoge"]
          ];
        });
        it("Sheet.insertRowsが呼び出されること", () => {
          expect(insertRows).toBeCalledWith(3);
        });
        it("Sheet.getRangeがセル左上、配列長の行数、配列要素の最大長の列数が指定されること", () => {
          expect(getRange).toBeCalledWith(1, 1, 3, 4);
        });
        it("Range.setValuesが引数で渡されたvaluesの要素の配列長が最大長に満たない場合空文字で埋められた値で呼び出されること", () => {
          expect(setValues).toBeCalledWith([
            ["foo", "bar", "", ""],
            ["bar", "baz", "", ""],
            ["hoge", "fuga", "piyo", "hoge"]
          ]);
        });
      });
    });
    describe("afterに3が指定されている場合", () => {
      beforeAll(() => {
        after = 3;
      });
      describe("シートにデータが存在しない場合", () => {
        beforeAll(() => {
          getLastRowRV = 0;
        });
        it("Sheet.deleteRowsが呼ばれないこと", () => {
          expect(deleteRows).not.toBeCalled();
        });
      });
      describe("シートにデータが存在する場合", () => {
        describe("開始位置より後にシートにデータが存在しない場合", () => {
          beforeAll(() => {
            getLastRowRV = 3;
          });
          it("deleteRowsが呼び出されないこと", () => {
            expect(deleteRows).not.toBeCalled();
          });
        });
        describe("開始位置より後にシートにデータが存在する場合", () => {
          beforeAll(() => {
            getLastRowRV = 4;
          });
          it("Sheet.deleteRowsが呼ばれること", () => {
            expect(deleteRows).toBeCalledWith(4, 1);
          });
        });
      });
      describe("値の存在する配列が渡された場合", () => {
        beforeAll(() => {
          values = [
            ["foo", "bar"],
            ["bar", "baz"],
            ["hoge", "fuga", "piyo", "hoge"]
          ];
        });

        it("Sheet.insertRowsAfterが呼び出されること", () => {
          expect(insertRowsAfter).toBeCalledWith(3, 3);
        });
        it("Sheet.getRangeがafterの値、配列長の行数、配列要素の最大長の列数が指定されること", () => {
          expect(getRange).toBeCalledWith(4, 1, 3, 4);
        });
      });
    });
  });
  describe("setSelectbox", () => {
    let row: number, column: number, numRows: number, numColumns: number, values: string[];
    beforeAll(() => {
      row = 1;
      column = 2;
      numRows = 3;
      numColumns = 4;
      values = ["0", "0.5", "1"];
      buildRV = values;
    });
    beforeEach(() => {
      const spreadsheet = Spreadsheet.openById("hogehoge");
      spreadsheet.setSelectbox("hoge", values, row, column, numRows, numColumns);
    });
    it("newDataValidationが呼び出されること", () => {
      expect(SpreadsheetApp.newDataValidation).toBeCalled();
    });
    it("requireValueInListが呼び出されること", () => {
      expect(requireValueInList).toBeCalledWith(["0", "0.5", "1"]);
    });
    it("buildが呼び出されること", () => {
      expect(build).toBeCalled();
    });
    it("getSheetByNameが呼び出されること", () => {
      expect(getSheetByName).toBeCalledWith("hoge");
    });
    it("getRangeが呼び出されること", () => {
      expect(getRange).toBeCalledWith(1, 2, 3, 4);
    });
    it("setDataValidationが呼び出されること", () => {
      expect(setDataValidation).toBeCalledWith(["0", "0.5", "1"]);
    });
  });
  describe("insertSheet", () => {
    const sheetname = "sheet";
    let regenerate: boolean;
    beforeEach(() => {
      const spreadsheet = Spreadsheet.openById("hogehoge");
      spreadsheet.insertSheet(sheetname, regenerate);
    });
    describe("同じsheetが存在しない場合", () => {
      beforeAll(() => {
        getSheetByNameRV = undefined;
      });
      it("指定したsheetnameのシートが作成されること", () => {
        expect(mockedSpreadSheet.insertSheet).toBeCalledWith(sheetname);
      });
    });
    describe("すでに同じsheetが存在する場合", () => {
      beforeAll(() => {
        getSheetByNameRV = getSheetByNameRVB;
      });
      describe("regerenate=trueの場合", () => {
        beforeAll(() => {
          regenerate = true;
        });
        it("既存のシートが削除されること", () => {
          expect(mockedSpreadSheet.deleteSheet).toBeCalledWith(mockedSheet);
        });
        it("指定したsheetnameのシートが作成されること", () => {
          expect(mockedSpreadSheet.insertSheet).toBeCalledWith(sheetname);
        });
      });
      describe("regenerate=falseの場合", () => {
        beforeAll(() => {
          regenerate = false;
        });
        it("既存のシートが削除されないこと", () => {
          expect(mockedSpreadSheet.deleteSheet).not.toBeCalled();
        });
        it("指定したsheetnameのシートが作成されないこと", () => {
          expect(mockedSpreadSheet.insertSheet).not.toBeCalled();
        });
      });
    });
  });
  describe("add", () => {
    const sheetname = "sheetname";
    const valuesBase = [["foo"], ["bar", "baz"], ["hoge", "fuga", "piyo", "hogehoge"]];
    const expectedValuesBase = [
      ["foo", "", "", ""],
      ["bar", "baz", "", ""],
      ["hoge", "fuga", "piyo", "hogehoge"]
    ];
    let values: unknown[][];
    beforeAll(() => {
      getLastRowRV = 0;
      values = [];
    });
    beforeEach(() => {
      const spreadsheet = Spreadsheet.openById("hogehoge");
      spreadsheet.add(sheetname, values);
    });
    it("指定したシートが選択されること", () => {
      expect(mockedSpreadSheet.getSheetByName).toBeCalledWith(sheetname);
    });
    describe("シートにデータが存在しないとき", () => {
      beforeAll(() => {
        getLastRowRV = 0;
      });
      describe("valuesが空のとき", () => {
        beforeAll(() => {
          values = [];
        });
        it("データが追加されないこと", () => {
          expect(mockedSheet.insertRows).not.toBeCalled();
          expect(mockedSheet.insertRowsAfter).not.toBeCalled();
          expect(mockedSheet.getRange).not.toBeCalled();
          expect(mockedRange.setValues).not.toBeCalled();
        });
      });
      describe("valuesに値が存在するとき", () => {
        beforeAll(() => {
          values = valuesBase;
        });
        it("1行目にデータが追加されること", () => {
          expect(mockedSheet.insertRows).toBeCalledWith(3);
          expect(mockedSheet.getRange).toBeCalledWith(1, 1, 3, 4);
          expect(mockedRange.setValues).toBeCalledWith(expectedValuesBase);
        });
      });
    });
    describe("シートにデータが存在するとき", () => {
      beforeAll(() => {
        getLastRowRV = 3;
      });
      describe("valuesが空のとき", () => {
        beforeAll(() => {
          values = [];
        });
        it("データが追加されないこと", () => {
          expect(mockedSheet.insertRows).not.toBeCalled();
          expect(mockedSheet.insertRowsAfter).not.toBeCalled();
          expect(mockedSheet.getRange).not.toBeCalled();
          expect(mockedRange.setValues).not.toBeCalled();
        });
      });
      describe("valuesに値が存在するとき", () => {
        beforeAll(() => {
          values = valuesBase;
        });
        it("末尾にデータが追加されること", () => {
          expect(mockedSheet.insertRowsAfter).toBeCalledWith(3, 3);
          expect(mockedSheet.getRange).toBeCalledWith(4, 1, 3, 4);
          expect(mockedRange.setValues).toBeCalledWith(expectedValuesBase);
        });
      });
    });
  });
});
