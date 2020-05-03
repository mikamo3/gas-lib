import { filter, isArray } from "underscore";

export type ModePriority = {
  [P in "test" | "development" | "production"]: number;
};
export type Mode = keyof ModePriority;
export type Logwriter = {
  log: (data: unknown) => void;
};
export type LogRule = {
  [P in "debug" | "info" | "warn" | "error" | "critical"]: Mode;
};

const defaultMode: Mode = "test";
const defaultModePriority: ModePriority = {
  test: 0,
  development: 1,
  production: 2
};
const defaultLogRule: LogRule = {
  debug: "development",
  info: "development",
  warn: "production",
  error: "production",
  critical: "production"
};

export class Log {
  private logwriter: Logwriter;
  private logRule: LogRule;
  private modePriority: ModePriority;
  private mode: keyof ModePriority;
  constructor(
    logwriter: Logwriter,
    mode = defaultMode,
    modePriority = defaultModePriority,
    logRule = defaultLogRule
  ) {
    this.logwriter = logwriter;
    this.logRule = logRule;
    this.modePriority = modePriority;
    this.mode = mode;
  }
  debug(data: unknown) {
    this.write("debug", data);
  }
  info(data: unknown) {
    this.write("info", data);
  }
  warn(data: unknown) {
    this.write("warn", data);
  }
  error(data: unknown) {
    this.write("error", data);
  }
  critical(data: unknown) {
    this.write("critical", data);
  }
  private writable(targetMode: keyof LogRule) {
    const nowPriority = this.modePriority[this.mode];
    const targetPriority = this.modePriority[this.logRule[targetMode]];
    return nowPriority <= targetPriority;
  }
  private write(mode: keyof LogRule, data: unknown) {
    let output: string;
    if (this.writable(mode)) {
      output = this.format(data) + "\n";
      if (mode === "debug") {
        output += "\n" + this.getTrace();
      }
      this.logwriter.log(output);
    }
  }
  private getTrace() {
    const trace = filter(new Error().stack.split("\n"), (_trace, idx) => idx > 1);
    return trace.reduce<string>((prev, cur) => {
      return prev + cur.trimLeft() + "\n";
    }, "\n");
  }
  private format(data: unknown, indent = 0) {
    const outputIndent = (str: string, indent: number) => {
      return " ".repeat(indent) + str;
    };
    if (typeof data === "string") {
      return outputIndent('"' + data + '"', indent);
    } else if (typeof data === "boolean") {
      return outputIndent(data ? "true" : "false", indent);
    } else if (typeof data === "number") {
      return outputIndent(String(data), indent);
    } else if (data === undefined) {
      return outputIndent("undefined", indent);
    } else if (data === null) {
      return outputIndent("null", indent);
    } else if (isArray(data)) {
      return `${outputIndent("[", indent)}
${data.reduce<string>((prev, cur, idx, array) => {
  prev = prev + this.format(cur, indent + 2);
  if (idx < array.length - 1) {
    return prev + ",\n";
  }
  return prev;
}, "")}
${outputIndent("]", indent)}`;
    } else if (typeof data === "object") {
      return `${outputIndent("{", indent)}
${Object.keys(data).reduce<string>((prev, key, idx, keys) => {
  prev += this.format(key, indent + 2) + ": " + this.format(data[key], indent + 2).trimLeft();
  if (idx < keys.length - 1) {
    prev += ",\n";
  }
  return prev;
}, "")}
${outputIndent("}", indent)}`;
    }
  }
}
