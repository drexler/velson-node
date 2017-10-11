/**
 * Class representing an error thrown by the Velson Engine
 *
 * @author drexler
 */
export class VelsonError {

  private issueLineNumber: number;
  private issueType: ErrorType;
  private message: string;

  get lineNumber(): number {
    return this.issueLineNumber;
  }

  get body(): string {
    return this.message;
  }

  get type(): ErrorType {
    return this.issueType;
  }

  /**
   * Creates an instance of Velson Error
   */
  public constructor(message: string) {
    this.issueLineNumber = -1;
    this.issueType = ErrorType.Unknown;
    this.message = message;
    this.parseError();
  }

  /**
   * Determines the error type and location of cause
   */
  private parseError(): void {
    // Determine error type
    if (this.message.includes('Invalid JSON')) {
      this.issueType = ErrorType.Json;
    } else if (this.message.match(/at( .*?).vm/).length > 0) {
      this.issueType = ErrorType.Template;
    }

    // locate root cause line number in the  error message
    // eg.[character 32 line 13] for JSON-based errors
    // eg. [line 2, column 9] for Template errors
    const regExp = /\[(.*?)\]/;
    try {
    const matches = regExp.exec(this.message);
    this.getErrorLineNumber(matches[1]);
    } catch (error) {
      // prevent error bubbling up.
    }
  }

  /**
   * Finds the line number responsible for the error message in a given string
   * @param {string} matcher - string containing the line number
   */
  private getErrorLineNumber(matcher: string ): void {
    const lineLocation = matcher.indexOf('line');
    if (this.issueType === ErrorType.Json) {
      this.issueLineNumber = Number.parseInt(matcher.substr(lineLocation + 4).trim(), 10);
    } else if (this.issueType === ErrorType.Template) {
      const commaIndex = matcher.indexOf(',');
      this.issueLineNumber = Number.parseInt(matcher.substr(lineLocation + 4, commaIndex).trim(), 10);
    }
  }
}

/**
 * Types of errors thrown by the Velson Engine
 */
export enum ErrorType {
  Json = 1,
  Template,
  Unknown,
}
