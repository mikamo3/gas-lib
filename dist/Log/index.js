"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = require("underscore");
var defaultLogWriter = {
    log: function (data) { return console.log(data); }
};
var defaultMode = "test";
var defaultModePriority = {
    test: 0,
    development: 1,
    production: 2
};
var defaultLogRule = {
    debug: "development",
    info: "development",
    warn: "production",
    error: "production",
    critical: "production"
};
var Log = /** @class */ (function () {
    function Log(logwriter, mode, modePriority, logRule) {
        if (logwriter === void 0) { logwriter = defaultLogWriter; }
        if (mode === void 0) { mode = defaultMode; }
        if (modePriority === void 0) { modePriority = defaultModePriority; }
        if (logRule === void 0) { logRule = defaultLogRule; }
        this.logwriter = logwriter;
        this.logRule = logRule;
        this.modePriority = modePriority;
        this.mode = mode;
    }
    Log.prototype.setLogwriter = function (logwriter) {
        this.logwriter = logwriter;
    };
    Log.prototype.setMode = function (mode) {
        this.mode = mode;
    };
    Log.prototype.setModePriority = function (modePriority) {
        this.modePriority = modePriority;
    };
    Log.prototype.setLogRule = function (logRule) {
        this.logRule = logRule;
    };
    Log.prototype.debug = function (data) {
        this.write("debug", data);
    };
    Log.prototype.info = function (data) {
        this.write("info", data);
    };
    Log.prototype.warn = function (data) {
        this.write("warn", data);
    };
    Log.prototype.error = function (data) {
        this.write("error", data);
    };
    Log.prototype.critical = function (data) {
        this.write("critical", data);
    };
    Log.prototype.writable = function (targetMode) {
        var nowPriority = this.modePriority[this.mode];
        var targetPriority = this.modePriority[this.logRule[targetMode]];
        return nowPriority <= targetPriority;
    };
    Log.prototype.write = function (mode, data) {
        if (this.writable(mode)) {
            var output = this.format(data) + "\n";
            this.logwriter.log(output);
        }
    };
    Log.prototype.getTrace = function () {
        var trace = underscore_1.filter(new Error().stack.split("\n"), function (_trace, idx) { return idx > 1; });
        return trace.reduce(function (prev, cur) {
            return prev + cur.trimLeft() + "\n";
        }, "\n");
    };
    Log.prototype.format = function (data, indent) {
        var _this = this;
        if (indent === void 0) { indent = 0; }
        var outputIndent = function (str, indent) {
            return " ".repeat(indent) + str;
        };
        if (typeof data === "string") {
            return outputIndent('"' + data + '"', indent);
        }
        else if (typeof data === "boolean") {
            return outputIndent(data ? "true" : "false", indent);
        }
        else if (typeof data === "number") {
            return outputIndent(String(data), indent);
        }
        else if (data === undefined) {
            return outputIndent("undefined", indent);
        }
        else if (data === null) {
            return outputIndent("null", indent);
        }
        else if (underscore_1.isArray(data)) {
            return outputIndent("[", indent) + "\n" + data.reduce(function (prev, cur, idx, array) {
                prev = prev + _this.format(cur, indent + 2);
                if (idx < array.length - 1) {
                    return prev + ",\n";
                }
                return prev;
            }, "") + "\n" + outputIndent("]", indent);
        }
        else if (typeof data === "object") {
            return outputIndent("{", indent) + "\n" + Object.keys(data).reduce(function (prev, key, idx, keys) {
                prev += _this.format(key, indent + 2) + ": " + _this.format(data[key], indent + 2).trimLeft();
                if (idx < keys.length - 1) {
                    prev += ",\n";
                }
                return prev;
            }, "") + "\n" + outputIndent("}", indent);
        }
    };
    return Log;
}());
exports.Log = Log;
exports.default = (function () {
    var logInstance;
    var getInstance = function () {
        if (!logInstance) {
            logInstance = new Log();
        }
        return logInstance;
    };
    return {
        setConfig: function (logwriter, mode, modePriority, logRule) {
            if (logwriter === void 0) { logwriter = defaultLogWriter; }
            if (mode === void 0) { mode = defaultMode; }
            if (modePriority === void 0) { modePriority = defaultModePriority; }
            if (logRule === void 0) { logRule = defaultLogRule; }
            if (!logInstance) {
                logInstance = new Log(logwriter, mode, modePriority, logRule);
                return;
            }
            logInstance.setLogwriter(logwriter);
            logInstance.setMode(mode);
            logInstance.setModePriority(modePriority);
            logInstance.setLogRule(logRule);
        },
        debug: function (data) {
            getInstance().debug(data);
        },
        info: function (data) {
            getInstance().info(data);
        },
        warn: function (data) {
            getInstance().warn(data);
        },
        error: function (data) {
            getInstance().error(data);
        },
        critical: function (data) {
            getInstance().critical(data);
        }
    };
})();
//# sourceMappingURL=index.js.map