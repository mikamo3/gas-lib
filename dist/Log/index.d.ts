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
    constructor(logwriter: Logwriter, mode: Mode, modePriority: ModePriority, logRule: LogRule);
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
