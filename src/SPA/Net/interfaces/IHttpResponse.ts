export interface IHttpResponse {
    statusCode: number;
    statusReason: string;
    success: boolean;
    contentType: string | null;
    body: any;
    charset: string | null;
    as<T>(): T;
  }