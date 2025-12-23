import fs from 'fs';
import https from 'https';

export interface MtlsAgentError {
  certPathMissing?: boolean;
  keyPathMissing?: boolean;
  caPathMissing?: boolean;
  certFileMissing?: boolean;
  keyFileMissing?: boolean;
  caFileMissing?: boolean;
  details?: string[];
}

export class MtlsAgentValidationError extends Error {
  public errors: MtlsAgentError;
  constructor(errors: MtlsAgentError) {
    super('mTLS agent validation failed');
    this.errors = errors;
    this.name = 'MtlsAgentValidationError';
  }
}

export class MtlsAgentHelper {
  static createAgentFromEnv(): https.Agent {
    const errors: MtlsAgentError = { details: [] };
    const certPath = process.env.CERT_PATH;
    const keyPath = process.env.KEY_PATH;
    const caPath = process.env.CA_PATH;

    if (!certPath) {
      errors.certPathMissing = true;
      errors.details!.push('CERT_PATH environment variable is missing.');
    } else if (!fs.existsSync(certPath)) {
      errors.certFileMissing = true;
      errors.details!.push(`Certificate file not found at path: ${certPath}`);
    }

    if (!keyPath) {
      errors.keyPathMissing = true;
      errors.details!.push('KEY_PATH environment variable is missing.');
    } else if (!fs.existsSync(keyPath)) {
      errors.keyFileMissing = true;
      errors.details!.push(`Key file not found at path: ${keyPath}`);
    }

    if (!caPath) {
      errors.caPathMissing = true;
      errors.details!.push('CA_PATH environment variable is missing.');
    } else if (!fs.existsSync(caPath)) {
      errors.caFileMissing = true;
      errors.details!.push(`CA file not found at path: ${caPath}`);
    }

    if (errors.details!.length > 0) {
      throw new MtlsAgentValidationError(errors);
    }

    let cert, key, ca;
    try {
      cert = fs.readFileSync(certPath!);
      key = fs.readFileSync(keyPath!);
      ca = fs.readFileSync(caPath!);
    } catch (err) {
      throw new MtlsAgentValidationError({ details: ['Could not read certificate, key, or CA file.'] });
    }
    return new https.Agent({ cert, key, ca });
  }
}
