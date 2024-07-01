import UtilsHandler from '@handlers/utils.handler';

import * as Joi from 'joi';

export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3100,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
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
  logger: process.env.LOGGER || ['verbose', 'advice', 'none'],
  defaultVersion: process.env.DEFAULT_VERSION || '1',
  jwt: {
    secret: process.env.JWT_SECRET || 'secret_default',
    ignoreExpiration: process.env.JWT_IGNORE_EXPIRATION === 'true',
    ttl: process.env.JWT_TTL || '7d',
  },
});

export const validationSchema = Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().optional(),
  JWT_IGNORE_EXPIRATION: Joi.boolean().default(false),
  JWT_TTL: Joi.string().default('7d'),
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'stage', 'production')
    .default('development'),
  CORS_ORIGIN: Joi.when('NODE_ENV', {
    is: Joi.string().valid('stage', 'production'),
    then: Joi.string().required(),
    otherwise: Joi.string().default('*'),
  }),
  ONLY_ORIGIN: Joi.boolean().default(false),
  HELMET_TRUST_DOMAINS: Joi.string().optional(),
  HELMET_CONTENT_SECURITY_POLICY_SPECIFIC_TRUST_DOMAINS: Joi.string()
    .custom(UtilsHandler.jsonValidator, 'JSON validation')
    .optional(),
  LOGGER: Joi.string().valid('verbose', 'advice', 'none').default('verbose'),
  DEFAULT_VERSION: Joi.number().default('1'),
});
