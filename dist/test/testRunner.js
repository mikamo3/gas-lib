"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var run = function (message, beforeRun, test, afterRun) {
    Logger.log(message);
    try {
        beforeRun();
        test();
    }
    catch (e) {
        Logger.log("fail");
        throw e;
    }
    finally {
        if (afterRun) {
            afterRun();
        }
    }
    Logger.log("pass");
};
exports.Test = {
    run: run
};
//# sourceMappingURL=testRunner.js.map