import { HttpErrorCode } from '@definitions/http.types';
import { HttpStatus } from '@nestjs/common';

interface PgErrorMapping {
  message: string;
  httpStatus: HttpStatus;
  errorCode: string;
  detailedMessages?: { [pattern: string]: string };
}

const pgErrorCodes: { [key: string]: PgErrorMapping } = {
  '23502': {
    message: 'Valor nulo na coluna viola a restrição de não-nulo',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.NULL_VALUE_NOT_ALLOWED,
    detailedMessages: {
      'null value in column "(.*)" of relation "(.*)" violates not-null constraint':
        'O valor da coluna $1 da tabela $2 não pode ser nulo.',
    },
  },
  '23503': {
    message: 'Violação de chave estrangeira',
    httpStatus: HttpStatus.CONFLICT,
    errorCode: HttpErrorCode.FOREIGN_KEY_VIOLATION,
    detailedMessages: {
      'insert or update on table "(.*)" violates foreign key constraint "(.*)"':
        'Violação de chave estrangeira na tabela $1 com a constraint $2.',
    },
  },
  '23505': {
    message: 'Violação de restrição única',
    httpStatus: HttpStatus.CONFLICT,
    errorCode: HttpErrorCode.UNIQUE_CONSTRAINT_VIOLATION,
    detailedMessages: {
      'duplicate key value violates unique constraint "(.*)"':
        'Valor duplicado viola a restrição de unicidade $1.',
    },
  },
  '23514': {
    message: 'Violação de restrição de verificação',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.CHECK_CONSTRAINT_VIOLATION,
    detailedMessages: {
      'new row for relation "(.*)" violates check constraint "(.*)"':
        'Violação de restrição de verificação na tabela $1 com a constraint $2.',
    },
  },
  '22001': {
    message: 'Truncamento de dados de string à direita',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.STRING_DATA_RIGHT_TRUNCATION,
    detailedMessages: {
      'value too long for type (.*)': 'Valor muito longo para o tipo $1.',
    },
  },
  '22003': {
    message: 'Valor numérico fora do intervalo',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.NUMERIC_VALUE_OUT_OF_RANGE,
    detailedMessages: {
      'numeric value out of range': 'Valor numérico fora do intervalo.',
    },
  },
  '22007': {
    message: 'Formato de data/hora inválido',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.INVALID_DATETIME_FORMAT,
    detailedMessages: {
      'invalid input syntax for type (.*)': 'Formato inválido para o tipo $1.',
    },
  },
  '22008': {
    message: 'Estouro de campo de data/hora',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.DATETIME_FIELD_OVERFLOW,
    detailedMessages: {
      'date/time field value out of range':
        'Valor de campo de data/hora fora do intervalo.',
    },
  },
  '22012': {
    message: 'Divisão por zero',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.DIVISION_BY_ZERO,
    detailedMessages: {
      'division by zero': 'Divisão por zero.',
    },
  },
  '23000': {
    message: 'Violação de integridade de restrição',
    httpStatus: HttpStatus.CONFLICT,
    errorCode: HttpErrorCode.INTEGRITY_CONSTRAINT_VIOLATION,
  },
  '23001': {
    message: 'Violação de restrição',
    httpStatus: HttpStatus.CONFLICT,
    errorCode: HttpErrorCode.RESTRICTION_VIOLATION,
  },
  '23504': {
    message:
      'Violação de chave estrangeira - chave não presente na tabela referenciada',
    httpStatus: HttpStatus.CONFLICT,
    errorCode: HttpErrorCode.FOREIGN_KEY_NOT_PRESENT,
  },
  '23506': {
    message: 'Violação de exclusão',
    httpStatus: HttpStatus.CONFLICT,
    errorCode: HttpErrorCode.EXCLUSION_VIOLATION,
  },
  '23507': {
    message: 'Não é possível atualizar a chave referenciada em outra tabela',
    httpStatus: HttpStatus.CONFLICT,
    errorCode: HttpErrorCode.FOREIGN_KEY_UPDATE_NOT_ALLOWED,
  },
  '23508': {
    message:
      'Inserção/atualização na tabela viola a restrição de chave estrangeira',
    httpStatus: HttpStatus.CONFLICT,
    errorCode: HttpErrorCode.FOREIGN_KEY_INSERT_UPDATE_VIOLATION,
  },
  '23513': {
    message: 'Violação de restrição de verificação',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.CHECK_CONSTRAINT_VIOLATION,
  },
  '23515': {
    message: 'Atualização de chave estrangeira inválida',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.INVALID_FOREIGN_KEY_UPDATE,
  },
  '25000': {
    message: 'Estado de transação inválido',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.INVALID_TRANSACTION_STATE,
  },
  '25001': {
    message: 'Transação SQL ativa',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.ACTIVE_SQL_TRANSACTION,
  },
  '25002': {
    message: 'Transação de ramo já ativa',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.BRANCH_TRANSACTION_ALREADY_ACTIVE,
  },
  '25003': {
    message: 'Modo de acesso inapropriado para transação de ramo',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.INAPPROPRIATE_ACCESS_MODE_FOR_BRANCH_TRANSACTION,
  },
  '25004': {
    message: 'Nível de isolamento inapropriado para transação de ramo',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode:
      HttpErrorCode.INAPPROPRIATE_ISOLATION_LEVEL_FOR_BRANCH_TRANSACTION,
  },
  '25005': {
    message: 'Estado de transação inválido',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.INVALID_TRANSACTION_STATE,
  },
  '25006': {
    message: 'Deadlock de transação detectado',
    httpStatus: HttpStatus.CONFLICT,
    errorCode: HttpErrorCode.TRANSACTION_DEADLOCK_DETECTED,
  },
  '25007': {
    message: 'Terminação de transação inválida',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.INVALID_TRANSACTION_TERMINATION,
  },
  '25P01': {
    message: 'Nenhuma transação SQL ativa',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.NO_ACTIVE_SQL_TRANSACTION,
  },
  '25P02': {
    message: 'Em transação SQL falhada',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.FAILED_SQL_TRANSACTION,
  },
  '42000': {
    message: 'Erro de sintaxe ou violação de regra de acesso',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.SYNTAX_ERROR_OR_ACCESS_RULE_VIOLATION,
  },
  '42501': {
    message: 'Privilégio insuficiente',
    httpStatus: HttpStatus.FORBIDDEN,
    errorCode: HttpErrorCode.INSUFFICIENT_PRIVILEGE,
  },
  '42703': {
    message: 'Coluna indefinida',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorCode: HttpErrorCode.UNDEFINED_COLUMN,
    detailedMessages: {
      'column "(.*)" does not exist': 'A coluna $1 não existe.',
    },
  },
};

function getDetailedErrorMessage(
  errorMapping: PgErrorMapping,
  errorMessage: string,
): string {
  console.log('errorMapping', errorMapping);
  console.log('errorMessage', errorMessage);
  if (errorMapping.detailedMessages) {
    for (const pattern in errorMapping.detailedMessages) {
      const regex = new RegExp(pattern);
      const match = regex.exec(errorMessage);
      if (match) {
        return errorMapping.detailedMessages[pattern].replace(
          /\$(\d+)/g,
          (_, index) => match[index],
        );
      }
    }
  }
  return errorMapping.message;
}

function getPgErrorMessage(code: string, error?: string): string {
  return error
    ? getDetailedErrorMessage(pgErrorCodes[code], error)
    : pgErrorCodes[code]?.message || 'Erro desconhecido no banco de dados';
}

function getPgErrorHttpStatus(code: string): HttpStatus {
  return pgErrorCodes[code]?.httpStatus || HttpStatus.INTERNAL_SERVER_ERROR;
}

function getPgErrorCode(code: string): string {
  return pgErrorCodes[code]?.errorCode || 'UNKNOWN_DATABASE_ERROR';
}

export {
  pgErrorCodes,
  getPgErrorMessage,
  getPgErrorHttpStatus,
  getPgErrorCode,
};
