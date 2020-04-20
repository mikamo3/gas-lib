export class SpreadsheetAppException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
export class SpreadsheetException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
