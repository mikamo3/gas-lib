"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("src/spreadsheet/errors");
var Spreadsheet_1 = require("src/spreadsheet/Spreadsheet");
var utils_1 = require("ts-jest/utils");
var openById = jest.fn();
var getSheetByName = jest.fn();
var getDataRange = jest.fn();
var getRange = jest.fn();
var getValues = jest.fn();
var setValues = jest.fn();
var deleteRows = jest.fn();
var getLastRow = jest.fn();
var insertRowsAfter = jest.fn();
var insertRows = jest.fn();
var mockedSpreadSheet = {
    getSheetByName: getSheetByName
};
var mockedSheet = {
    getRange: getRange,
    getDataRange: getDataRange,
    deleteRows: deleteRows,
    getLastRow: getLastRow,
    insertRowsAfter: insertRowsAfter,
    insertRows: insertRows
};
var mockedRange = {
    getValues: getValues,
    setValues: setValues
};
var getValuesRVB = [[]];
var getValuesRV;
var getLastRowRVB = 0;
var getLastRowRV;
SpreadsheetApp.openById = openById;
beforeAll(function () {
    getLastRowRV = getLastRowRVB;
    getValuesRV = getValuesRVB;
});
beforeEach(function () {
    openById.mockReturnValue(mockedSpreadSheet);
    getSheetByName.mockReturnValue(mockedSheet);
    getDataRange.mockReturnValue(mockedRange);
    getRange.mockReturnValue(mockedRange);
    getValues.mockReturnValue(getValuesRV);
    getLastRow.mockReturnValue(getLastRowRV);
});
afterEach(function () {
    jest.resetAllMocks();
});
describe("Spreadsheet", function () {
    describe("openById", function () {
        var id = "hogehoge";
        var spreadSheet;
        afterEach(function () {
            spreadSheet = undefined;
        });
        var runOpenById = function () {
            spreadSheet = Spreadsheet_1.Spreadsheet.openById(id);
        };
        describe("実行時", function () {
            beforeEach(function () {
                runOpenById();
            });
            it("SpreadsheetApp.openByIdが指定した引数で呼び出されること", function () {
                expect(SpreadsheetApp.openById).toBeCalledWith("hogehoge");
            });
        });
        describe("SpreadsheetApp.openByIdが例外を出した場合", function () {
            beforeEach(function () {
                openById.mockImplementation(function () {
                    throw "error";
                });
            });
            it("SpreadSheetAppExceptionが発生すること", function () {
                expect(runOpenById).toThrowError(new errors_1.SpreadsheetAppException("error"));
            });
        });
        describe("SpreadSheetApp.openByIdが例外を出さなかった場合", function () {
            beforeEach(function () {
                runOpenById();
            });
            it("SpreadSheetのインスタンスが返却されること", function () {
                expect(spreadSheet).toBeInstanceOf(Spreadsheet_1.Spreadsheet);
            });
        });
    });
    describe("getAllValues", function () {
        var actual;
        afterEach(function () {
            actual = undefined;
        });
        var runGetAllValues = function () {
            var spreadSheet = Spreadsheet_1.Spreadsheet.openById("hogehoge");
            actual = spreadSheet.getAllValues("sheet");
        };
        describe("Spreadsheet.getSheetByNameが例外を出した場合", function () {
            beforeEach(function () {
                utils_1.mocked(getSheetByName).mockImplementation(function () {
                    throw "error";
                });
            });
            it("SpreadsheetExceptionが発生すること", function () {
                expect(runGetAllValues).toThrowError(new errors_1.SpreadsheetException("error"));
            });
        });
        describe("Spreadsheet.getSheetByNameが例外を出さなかった場合", function () {
            beforeEach(function () {
                runGetAllValues();
            });
            it("Sheet.getDataRangeが呼び出されること", function () {
                expect(getDataRange).toBeCalled();
            });
            it("Range.getValuesが呼び出されること", function () {
                expect(getValues).toBeCalled();
            });
        });
        describe("セルにデータが存在しない場合", function () {
            beforeAll(function () {
                getValuesRV = [[""]];
            });
            beforeEach(function () {
                runGetAllValues();
            });
            it("空配列が返却されること", function () {
                expect(actual).toEqual([]);
            });
        });
        describe("セルにデータが存在する場合", function () {
            beforeAll(function () {
                getValuesRV = [
                    ["foo", "bar"],
                    ["bar", "baz"]
                ];
            });
            beforeEach(function () {
                runGetAllValues();
            });
            it("getValuesの結果が返却されること", function () {
                expect(actual).toEqual(getValuesRV);
            });
        });
    });
    describe("replace", function () {
        var values;
        var after = 1;
        beforeEach(function () {
            var spreadSheet = Spreadsheet_1.Spreadsheet.openById("hogehoge");
            spreadSheet.replace("sheet", values, after);
        });
        describe("undefinedが渡された場合", function () {
            beforeAll(function () {
                values = undefined;
            });
            it("Sheet.getRangeが呼び出されないこと", function () {
                expect(getRange).not.toBeCalled();
            });
        });
        describe("afterに0が指定されている場合", function () {
            beforeAll(function () {
                after = 0;
            });
            describe("シートにデータが存在しない場合", function () {
                beforeAll(function () {
                    getLastRowRV = 0;
                });
                it("Sheet.deleteRowsが呼ばれないこと", function () {
                    expect(deleteRows).not.toBeCalled();
                });
            });
            describe("シートにデータが存在する場合", function () {
                beforeAll(function () {
                    getLastRowRV = 5;
                });
                it("Sheet.deleteRowsが呼ばれること", function () {
                    expect(deleteRows).toBeCalledWith(1, 5);
                });
            });
            describe("空配列が渡された場合", function () {
                beforeAll(function () {
                    values = [];
                });
                it("Sheet.setValuesが呼び出されないこと", function () {
                    expect(setValues).not.toBeCalled();
                });
            });
            describe("値の存在する配列が渡された場合", function () {
                beforeAll(function () {
                    values = [
                        ["foo", "bar"],
                        ["bar", "baz"],
                        ["hoge", "fuga", "piyo", "hoge"]
                    ];
                });
                it("Sheet.insertRowsが呼び出されること", function () {
                    expect(insertRows).toBeCalledWith(3);
                });
                it("Sheet.getRangeがセル左上、配列長の行数、配列要素の最大長の列数が指定されること", function () {
                    expect(getRange).toBeCalledWith(1, 1, 3, 4);
                });
                it("Range.setValuesが引数で渡されたvaluesの要素の配列長が最大長に満たない場合空文字で埋められた値で呼び出されること", function () {
                    expect(setValues).toBeCalledWith([
                        ["foo", "bar", "", ""],
                        ["bar", "baz", "", ""],
                        ["hoge", "fuga", "piyo", "hoge"]
                    ]);
                });
            });
        });
        describe("afterに3が指定されている場合", function () {
            beforeAll(function () {
                after = 3;
            });
            describe("シートにデータが存在しない場合", function () {
                beforeAll(function () {
                    getLastRowRV = 0;
                });
                it("Sheet.deleteRowsが呼ばれないこと", function () {
                    expect(deleteRows).not.toBeCalled();
                });
            });
            describe("シートにデータが存在する場合", function () {
                describe("開始位置より後にシートにデータが存在しない場合", function () {
                    beforeAll(function () {
                        getLastRowRV = 3;
                    });
                    it("deleteRowsが呼び出されないこと", function () {
                        expect(deleteRows).not.toBeCalled();
                    });
                });
                describe("開始位置より後にシートにデータが存在する場合", function () {
                    beforeAll(function () {
                        getLastRowRV = 4;
                    });
                    it("Sheet.deleteRowsが呼ばれること", function () {
                        expect(deleteRows).toBeCalledWith(4, 1);
                    });
                });
            });
            describe("値の存在する配列が渡された場合", function () {
                beforeAll(function () {
                    values = [
                        ["foo", "bar"],
                        ["bar", "baz"],
                        ["hoge", "fuga", "piyo", "hoge"]
                    ];
                });
                it("Sheet.insertRowsAfterが呼び出されること", function () {
                    expect(insertRowsAfter).toBeCalledWith(3, 3);
                });
                it("Sheet.getRangeがafterの値、配列長の行数、配列要素の最大長の列数が指定されること", function () {
                    expect(getRange).toBeCalledWith(4, 1, 3, 4);
                });
            });
        });
    });
});
//# sourceMappingURL=Spreadseet.test.js.map