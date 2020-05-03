import { Logwriter, LogRule, Log, ModePriority, Mode } from "src/Log";
const logger = {
  log: jest.fn<void, [unknown]>()
};
afterEach(() => {
  jest.clearAllMocks();
});
describe("Log", () => {
  const logRuleDefault: LogRule = {
    debug: "development",
    info: "development",
    error: "production",
    warn: "production",
    critical: "production"
  };
  const modeDetault: Mode = "development";
  const modePriorityDefault: ModePriority = {
    test: 0,
    development: 1,
    production: 2
  };
  let log: Log;
  let logWriter: Logwriter;
  let logRule: LogRule;
  let modePriority: ModePriority;
  let mode: Mode;
  beforeAll(() => {
    logWriter = logger;
    logRule = logRuleDefault;
    modePriority = modePriorityDefault;
    mode = modeDetault;
  });
  beforeEach(() => {
    log = new Log(logWriter, mode, modePriority, logRule);
  });
  describe("logger.writeの呼び出し確認", () => {
    describe("modePriority= test > development > production", () => {
      beforeAll(() => {
        modePriority = {
          test: 0,
          development: 1,
          production: 2
        };
      });
      describe("mode=test", () => {
        beforeAll(() => {
          mode = "test";
        });
        describe("logRule=すべて出力", () => {
          beforeAll(() => {
            logRule = {
              debug: "test",
              info: "test",
              warn: "test",
              error: "test",
              critical: "test"
            };
          });
          describe("debug", () => {
            beforeEach(() => {
              log.debug("");
            });
            it("呼び出されること", () => {
              expect(logger.log).toBeCalled();
            });
          });
          describe("info", () => {
            beforeEach(() => {
              log.info("");
            });
            it("呼び出されること", () => {
              expect(logger.log).toBeCalled();
            });
          });
          describe("warn", () => {
            beforeEach(() => {
              log.warn("");
            });
            it("呼び出されること", () => {
              expect(logger.log).toBeCalled();
            });
          });
          describe("error", () => {
            beforeEach(() => {
              log.error("");
            });
            it("呼び出されること", () => {
              expect(logger.log).toBeCalled();
            });
          });
          describe("critical", () => {
            beforeEach(() => {
              log.critical("");
            });
            it("呼び出されること", () => {
              expect(logger.log).toBeCalled();
            });
          });
        });
      });
      describe("mode=production", () => {
        beforeAll(() => {
          mode = "production";
        });
        describe("logRule=debug,infoは出力しない", () => {
          beforeAll(() => {
            logRule = {
              debug: "test",
              info: "test",
              warn: "production",
              error: "production",
              critical: "production"
            };
          });
          describe("debug", () => {
            beforeEach(() => {
              log.debug("");
            });
            it("呼び出されないこと", () => {
              expect(logger.log).not.toBeCalled();
            });
          });
          describe("info", () => {
            beforeEach(() => {
              log.info("");
            });
            it("呼び出されないこと", () => {
              expect(logger.log).not.toBeCalled();
            });
          });
          describe("warn", () => {
            beforeEach(() => {
              log.warn("");
            });
            it("呼び出されること", () => {
              expect(logger.log).toBeCalled();
            });
          });
          describe("error", () => {
            beforeEach(() => {
              log.error("");
            });
            it("呼び出されること", () => {
              expect(logger.log).toBeCalled();
            });
          });
          describe("critical", () => {
            beforeEach(() => {
              log.critical("");
            });
            it("呼び出されること", () => {
              expect(logger.log).toBeCalled();
            });
          });
        });
      });
    });
  });
  describe("フォーマットの確認", () => {
    beforeAll(() => {
      mode = modeDetault;
      modePriority = modePriorityDefault;
      logRule = logRuleDefault;
    });
    beforeEach(() => {
      log = new Log(logWriter, mode, modePriority, logRule);
    });
    describe("出力フォーマットの確認", () => {
      let data: unknown;
      beforeEach(() => {
        log.info(data);
      });
      describe("オブジェクトが渡されたとき", () => {
        beforeAll(() => {
          data = {
            foo: "hoge",
            bar: "fuga",
            baz: 123,
            hoge: null,
            fuga: undefined,
            piyo: true,
            hogehoge: false
          };
        });
        it("出力フォーマットが正しいこと", () => {
          expect(logger.log).toBeCalledWith(`{
  "foo": "hoge",
  "bar": "fuga",
  "baz": 123,
  "hoge": null,
  "fuga": undefined,
  "piyo": true,
  "hogehoge": false
}
`);
        });
      });
      describe("配列が入れ子のとき", () => {
        beforeAll(() => {
          data = ["foo", "bar", ["bar", ["baz"]]];
        });
        it("出力フォーマットが正しいこと", () => {
          expect(logger.log).toBeCalledWith(`[
  "foo",
  "bar",
  [
    "bar",
    [
      "baz"
    ]
  ]
]
`);
        });
      });
      describe("オブジェクトが入れ子のとき", () => {
        beforeAll(() => {
          data = {
            foo: {
              bar: {
                baz: "hoge"
              }
            }
          };
        });
        it("出力フォーマットが正しいこと", () => {
          expect(logger.log).toBeCalledWith(`{
  "foo": {
    "bar": {
      "baz": "hoge"
    }
  }
}
`);
        });
      });
    });
    describe("stack出力確認", () => {
      describe("debug", () => {
        beforeEach(() => {
          log.debug("hoge");
        });
        it("出力されること", () => {
          expect(logger.log.mock.calls[0][0]).toContain("at");
        });
      });
    });
    describe("debug以外", () => {
      beforeEach(() => {
        log.info("hoge");
      });
      it("出力されないこと", () => {
        expect(logger.log.mock.calls[0][0]).not.toContain("at");
      });
    });
  });
});
