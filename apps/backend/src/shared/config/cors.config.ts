export function corsConfig(origins: string, onlyOrigin: boolean) {
  const whitelist = origins === '*' ? [] : origins.split(',');

  if (origins === '*') {
    return {
      origin: origins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true,
    };
  }

  return {
    origin: function (originReq, callback) {
      if (
        getCorsOriginVerificationWhitelist(whitelist, onlyOrigin, originReq)
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  };
}

function getCorsOriginVerificationWhitelist(
  whitelist: string[],
  onlyOriginFlag,
  origin,
) {
  let corsOriginVerificationWhitelist = true;
  if (onlyOriginFlag)
    corsOriginVerificationWhitelist = whitelist.indexOf(origin) !== -1;
  else
    corsOriginVerificationWhitelist =
      whitelist.indexOf(origin) !== -1 || !origin;

  return corsOriginVerificationWhitelist;
}
