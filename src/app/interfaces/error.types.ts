export interface TErrorSources {
  path: string;
  message: string
}

export interface TGenericErrResponse {
  statusCode: number,
  message: string,
  errorSources? : TErrorSources[]
}