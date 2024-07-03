import { formatInTimeZone } from 'date-fns-tz';
import * as chalk from 'chalk';

export default function getMorgan(morgan: any): any {
  //   const morganFormat =
  //     ':id => :date-br Req= :method :url :status :res[content-length] - :response-time ms';
  // Definindo o token para ID da requisição
  morgan.token('id', function getId(req) {
    return (req.headers['x-request-id'] as string) ?? 'null-id';
  });

  // Definindo o token para o método HTTP com cores
  morgan.token('method', function getMethod(req) {
    const method = req.method;
    if (method === 'GET') {
      return chalk.blue(method);
    } else if (method === 'POST') {
      return chalk.green(method);
    } else if (method === 'PUT') {
      return chalk.yellow(method);
    } else if (method === 'DELETE') {
      return chalk.red(method);
    } else if (method === 'PATCH') {
      return chalk.magenta(method);
    }
    return method;
  });

  // Definindo o token para o status da resposta com cores
  morgan.token('status', function getStatus(req, res) {
    const status = res.statusCode;
    if (status >= 500) {
      return chalk.red(status.toString());
    } else if (status >= 400) {
      return chalk.yellow(status.toString());
    } else if (status >= 300) {
      return chalk.cyan(status.toString());
    } else if (status >= 200) {
      return chalk.green(status.toString());
    }
    return status.toString();
  });

  morgan.token('id', function getId(req) {
    return chalk.bgRed((req.headers['x-request-id'] as string) ?? 'null-id');
  });

  //   // Definindo o token para a data formatada no fuso horário de São Paulo
  morgan.token('date-br', function getDate() {
    const timezone = 'America/Sao_Paulo';
    const date = new Date();
    return chalk.yellow(
      formatInTimeZone(date, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    );
  });

  //   // Definindo o token para o método HTTP com cores

  //   // Definindo o token para o URL
  morgan.token('url', function getMethod(req) {
    const method = req.method;
    if (method === 'GET') {
      return chalk.blue(req.originalUrl);
    } else if (method === 'POST') {
      return chalk.green(req.originalUrl);
    } else if (method === 'PUT') {
      return chalk.yellow(req.originalUrl);
    } else if (method === 'DELETE') {
      return chalk.red(req.originalUrl);
    } else if (method === 'PATCH') {
      return chalk.magenta(req.originalUrl);
    }
    return req.originalUrl;
  });

  //   // Definindo o token para o tamanho do conteúdo da resposta
  //   morgan.token('res-content-length', function getContentLength(req, res) {
  //     return chalk.red(res.getHeader('content-length') as string);
  //   });

  //   // Definindo o token para o tempo de resposta
  morgan.token(
    'response-time',
    function getResponseTimeToken(req, res, digits) {
      if (!req._startAt || !res._startAt) {
        // missing request and/or response start time
        return;
      }

      // calculate diff
      const ms =
        (res._startAt[0] - req._startAt[0]) * 1e3 +
        (res._startAt[1] - req._startAt[1]) * 1e-6;

      // return truncated value
      const val = ms.toFixed(digits === undefined ? 3 : digits);

      if (ms < 1000) {
        return chalk.green(`${val}ms`);
      } else if (ms < 3000) {
        return chalk.yellow(`${val}ms`);
      }
      return chalk.red(`${val}ms`);
    },
  );

  return morgan;
}
