export class FetchError extends Error {
  private status: number;
  private statusText: string;

  constructor(
    message: string,
    status: number,
    statusText: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.status = status;
    this.statusText = statusText;
  }

  public toString() {
    return `Fetch Error: mssg: ${this.message}, status: ${this.status}, statusText: ${this.statusText}`;
  }

  public getStatusCode() {
    return this.status;
  }
  public getStatusText() {
    return this.statusText;
  }
}

export const createFetchError = (
  errMsg: string,
  response: Response,
  errOptions?: ErrorOptions,
): FetchError =>
  new FetchError(errMsg, response.status, response.statusText, errOptions);
