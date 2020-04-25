import { isEqual, isMatch } from "underscore";

export class AssertionError extends Error {
  constructor(actual: unknown, expected: unknown) {
    super();
    Logger.log({ actual, expected });
  }
}

export const assert = (message: string) => {
  const logAssertMessage = (m: string) => {
    const msg = m;
    return (assertOK = true) => {
      const result = assertOK ? "OK" : "NG";
      Logger.log(`${msg} : ${result}`);
    };
  };
  const log = logAssertMessage(message);
  return {
    toEqual: (actual: unknown, expected: unknown) => {
      if (!isEqual(actual, expected)) {
        log(false);
        throw new AssertionError(actual, expected);
      }
      log();
    },
    toMatchObject: (actual: object, expected: object) => {
      if (!isMatch(actual, expected)) {
        log(false);
        throw new AssertionError(actual, expected);
      }
      log();
    }
  };
};
