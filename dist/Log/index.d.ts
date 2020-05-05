export declare type ModePriority = {
    [P in "test" | "development" | "production"]: number;
};
export declare type Mode = keyof ModePriority;
export declare type Logwriter = {
    log: (data: unknown) => void;
};
export declare type LogRule = {
    [P in "debug" | "info" | "warn" | "error" | "critical"]: Mode;
};
export declare class Log {
    private logwriter;
    private logRule;
    private modePriority;
    private mode;
    constructor(logwriter?: Logwriter, mode?: "test" | "development" | "production", modePriority?: ModePriority, logRule?: LogRule);
    setLogwriter(logwriter: Logwriter): void;
    setMode(mode: Mode): void;
    setModePriority(modePriority: ModePriority): void;
    setLogRule(logRule: LogRule): void;
    debug(data: unknown): void;
    info(data: unknown): void;
    warn(data: unknown): void;
    error(data: unknown): void;
    critical(data: unknown): void;
    private writable;
    private write;
    private getTrace;
    private format;
}
declare const _default: {
    setConfig: (logwriter?: Logwriter, mode?: "test", modePriority?: ModePriority, logRule?: LogRule) => void;
    debug: (data: unknown) => void;
    info: (data: unknown) => void;
    warn: (data: unknown) => void;
    error: (data: unknown) => void;
    critical: (data: unknown) => void;
};
export default _default;
