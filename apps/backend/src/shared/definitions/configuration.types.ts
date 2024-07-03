import UtilsHandler from '@handlers/utils.handler';

import * as Joi from 'joi';

export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3100,
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    onlyOrigin: process.env.ONLY_ORIGIN === 'true',
  },
  helmet: {
    trustDomains: process.env.HELMET_TRUST_DOMAINS
      ? process.env.HELMET_TRUST_DOMAINS.split(',')
      : [],
    contentSecurityPolicySpecificTrustDomains: process.env
      .HELMET_CONTENT_SECURITY_POLICY_SPECIFIC_TRUST_DOMAINS
      ? JSON.parse(
          process.env.HELMET_CONTENT_SECURITY_POLICY_SPECIFIC_TRUST_DOMAINS,
        )
      : {},
  },
  logger: process.env.LOGGER_LEVEL || false,
  defaultVersion: process.env.DEFAULT_VERSION || '1',
  jwt: {
    secret: process.env.JWT_SECRET || 'secret_default',
    ignoreExpiration: process.env.JWT_IGNORE_EXPIRATION === 'true',
    ttl: process.env.JWT_TTL || '7d',
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING
      ? process.env.DATABASE_LOGGING.split(',')
      : false,
  },
  validationDTO: {
    transform: process.env.VALIDATION_DTO_TRANSFORM === 'true',
    whitelist: process.env.VALIDATION_DTO_WHITELIST === 'true',
    forbidNonWhitelisted:
      process.env.VALIDATION_DTO_FORBID_NON_WHITELISTED === 'true',
  },
});

export const validationSchema = Joi.object({
  // Base
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'stage', 'production')
    .default('development'),

  // Database
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
  DATABASE_LOGGING: Joi.string()
    .custom(UtilsHandler.loggingValidator, 'Logging validation')
    .default('query'),

  // CORS
  CORS_ORIGIN: Joi.when('NODE_ENV', {
    is: Joi.string().valid('stage', 'production'),
    then: Joi.string().required(),
    otherwise: Joi.string().default('*'),
  }),
  ONLY_ORIGIN: Joi.boolean().default(false),

  // Helmet
  HELMET_TRUST_DOMAINS: Joi.string().optional(),
  HELMET_CONTENT_SECURITY_POLICY_SPECIFIC_TRUST_DOMAINS: Joi.string()
    .custom(UtilsHandler.jsonValidator, 'JSON validation')
    .optional(),
  LOGGER_LEVEL: Joi.string()
    .valid('verbose', 'advice', 'none')
    .default('verbose'),
  DEFAULT_VERSION: Joi.number().default('1'),

  // Validation DTO
  VALIDATION_DTO_TRANSFORM: Joi.boolean().default(true),
  VALIDATION_DTO_WHITELIST: Joi.boolean().default(true),
  VALIDATION_DTO_FORBID_NON_WHITELISTED: Joi.boolean().default(true),

  // JWT
  JWT_SECRET: Joi.string().optional(),
  JWT_IGNORE_EXPIRATION: Joi.boolean().default(false),
  JWT_TTL: Joi.string().default('7d'),
});
