export declare class AssertionError extends Error {
    constructor(actual: unknown, expected: unknown);
}
export declare const assert: (message: string) => {
    toEqual: (actual: unknown, expected: unknown) => void;
    toMatchObject: (actual: object, expected: object) => void;
};
export declare const test: (message: string, beforeRun: Function, test: Function, afterRun?: Function) => void;
