export interface MtResponse<T> {
  statusCode: number;
  body: {
    status: "error" | "success";
    message?: string;
    data?: T;
  };
  files?: T;
}

export enum StatusCode {
  SUCCESS = 200,
  CREATED = 201,
  NOT_RESPONSE = 203,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  SERVER_ERROR = 500,
}
