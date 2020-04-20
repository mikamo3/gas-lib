import { SpreadsheetAppException, SpreadsheetException } from "src/spreadsheet/errors";
import { Spreadsheet } from "src/spreadsheet/Spreadsheet";
import { mocked } from "ts-jest/utils";

const openById = jest.fn();
const getSheetByName = jest.fn();
const getDataRange = jest.fn();
const getRange = jest.fn();
const getValues = jest.fn();
const setValues = jest.fn();
const clear = jest.fn();
const mockedSpreadSheet: Partial<{ [s in keyof GoogleAppsScript.Spreadsheet.Spreadsheet]: any }> = {
  getSheetByName
};
const mockedSheet: Partial<{ [s in keyof GoogleAppsScript.Spreadsheet.Sheet]: any }> = {
  clear,
  getRange,
  getDataRange
};
const mockedRange: Partial<{ [s in keyof GoogleAppsScript.Spreadsheet.Range]: any }> = {
  getValues,
  setValues
};
const getValuesRVB = [[]];
let getValuesRV;
SpreadsheetApp.openById = openById;

beforeAll(() => {
  getValuesRV = getValuesRVB;
});
beforeEach(() => {
  openById.mockReturnValue(mockedSpreadSheet);
  getSheetByName.mockReturnValue(mockedSheet);
  getDataRange.mockReturnValue(mockedRange);
  getRange.mockReturnValue(mockedRange);
  getValues.mockReturnValue(getValuesRV);
});

afterEach(() => {
  jest.resetAllMocks();
});
describe("Spreadsheet", () => {
  describe("openById", () => {
    const id = "hogehoge";
    let spreadSheet: Spreadsheet;
    afterEach(() => {
      spreadSheet = undefined;
    });
    const runOpenById = () => {
      spreadSheet = Spreadsheet.openById(id);
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
        expect(spreadSheet).toBeInstanceOf(Spreadsheet);
      });
    });
  });
  describe("getAllValues", () => {
    let actual;
    afterEach(() => {
      actual = undefined;
    });
    const runGetAllValues = () => {
      const spreadSheet = Spreadsheet.openById("hogehoge");
      actual = spreadSheet.getAllValues("sheet");
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
    beforeEach(() => {
      const spreadSheet = Spreadsheet.openById("hogehoge");
      spreadSheet.replace("sheet", values);
    });
    it("Sheet.clearが呼ばれること", () => {
      expect(clear).toBeCalled();
    });
    describe("undefinedが渡された場合", () => {
      beforeAll(() => {
        values = undefined;
      });
      it("Sheet.getRangeが呼び出されないこと", () => {
        expect(getRange).not.toBeCalled();
      });
    });
    describe("空配列が渡された場合", () => {
      beforeAll(() => {
        values = [];
      });
      it("Sheet.getRangeが呼び出されないこと", () => {
        expect(getRange).not.toBeCalled();
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
});
