import { Request } from "express";
import TokenData from "./encode-decode";

export interface MtRequest<T> extends Request {
  userDetails?: TokenData;
  body: T;
}
