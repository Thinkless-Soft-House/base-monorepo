import { HelmetOptions } from 'helmet';

export default function helmetConfig(
  env: 'development' | 'stage' | 'production',
  options: {
    trustDomains?: string[];
    contentSecurityPolicySpecificTrustDomains?: {
      [key: string]: string[];
    };
  } = {},
): HelmetOptions {
  const trustDomains = options.trustDomains || [];
  const contentSecurityPolicySpecificTrustDomains =
    options.contentSecurityPolicySpecificTrustDomains || {};

  return {
    contentSecurityPolicy:
      env !== 'development'
        ? {
            directives: {
              defaultSrc: [
                "'self'",
                ...trustDomains,
                ...contentSecurityPolicySpecificTrustDomains['defaultSrc'],
              ],
              scriptSrc: [
                "'self'",
                ...trustDomains,
                ...contentSecurityPolicySpecificTrustDomains['scriptSrc'],
              ],
              styleSrc: [
                "'self'",
                ...trustDomains,
                ...contentSecurityPolicySpecificTrustDomains['styleSrc'],
              ],
              fontSrc: [
                "'self'",
                ...trustDomains,
                ...contentSecurityPolicySpecificTrustDomains['fontSrc'],
              ],
              imgSrc: [
                "'self'",
                ...trustDomains,
                ...contentSecurityPolicySpecificTrustDomains['imgSrc'],
              ],
              connectSrc: [
                "'self'",
                ...trustDomains,
                ...contentSecurityPolicySpecificTrustDomains['connectSrc'],
              ],
              objectSrc: ["'none'"],
              upgradeInsecureRequests: [],
              frameAncestors: ["'self'"],
            },
          }
        : false,
    referrerPolicy: env !== 'development' ? { policy: 'same-origin' } : false,
    frameguard: env !== 'development' ? { action: 'deny' } : false,
    hidePoweredBy: env !== 'development',
    hsts:
      env !== 'development'
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
    noSniff: env !== 'development',
    xssFilter: env !== 'development',
  };
}
