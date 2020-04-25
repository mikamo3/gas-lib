const run = (message: string, beforeRun: Function, test: Function, afterRun?: Function) => {
  Logger.log(message);
  try {
    beforeRun();
    test();
  } catch (e) {
    Logger.log("fail");
    throw e;
  } finally {
    if (afterRun) {
      afterRun();
    }
  }
  Logger.log("pass");
};
export const Test = {
  run
};
