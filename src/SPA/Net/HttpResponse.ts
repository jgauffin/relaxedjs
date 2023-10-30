import { IHttpResponse } from "./interfaces/IHttpResponse";

export class HttpError extends Error {
    message: string;
    response: IHttpResponse;
  
    constructor(response: IHttpResponse) {
      super(response.statusReason);
      this.message = response.statusReason;
      this.response = response;
    }
  }
  