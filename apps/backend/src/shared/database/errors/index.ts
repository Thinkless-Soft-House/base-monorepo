import {
  getPgErrorCode,
  getPgErrorHttpStatus,
  getPgErrorMessage,
  pgErrorCodes,
} from './errors-pg.model';

const DB = 'postgres';

let dbErrorBuilder: any = {};

switch (DB) {
  case 'postgres':
    dbErrorBuilder = {
      errorCodes: pgErrorCodes,
      getErrorMessage: getPgErrorMessage,
      getErrorHttpStatus: getPgErrorHttpStatus,
      getErrorCode: getPgErrorCode,
    };
    break;

  default:
    dbErrorBuilder = {
      errorCodes: pgErrorCodes,
      getErrorMessage: getPgErrorMessage,
      getErrorHttpStatus: getPgErrorHttpStatus,
      getErrorCode: getPgErrorCode,
    };
    break;
}

export { dbErrorBuilder as default };
