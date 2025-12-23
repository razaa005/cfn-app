import fs from 'fs';
import https from 'https';
import path from 'path';
import { MtlsAgentHelper, MtlsAgentValidationError } from '../src/helpers/mtls-agent-helper';

describe('MtlsAgentHelper', () => {
  const envBackup = { ...process.env };
  const tmpDir = path.join(__dirname, 'tmp-mtls');
  const certPath = path.join(tmpDir, 'cert.pem');
  const keyPath = path.join(tmpDir, 'key.pem');
  const caPath = path.join(tmpDir, 'ca.pem');

  beforeAll(() => {
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(certPath, 'dummy-cert');
    fs.writeFileSync(keyPath, 'dummy-key');
    fs.writeFileSync(caPath, 'dummy-ca');
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  afterEach(() => {
    process.env = { ...envBackup };
  });

  it('throws error if CERT_PATH is missing', () => {
    process.env.CERT_PATH = '';
    process.env.KEY_PATH = keyPath;
    process.env.CA_PATH = caPath;
    expect(() => MtlsAgentHelper.createAgentFromEnv()).toThrow(MtlsAgentValidationError);
    try {
      MtlsAgentHelper.createAgentFromEnv();
    } catch (e: any) {
      expect(e.errors.certPathMissing).toBe(true);
      expect(e.errors.details).toContain('CERT_PATH environment variable is missing.');
    }
  });

  it('throws error if KEY_PATH is missing', () => {
    process.env.CERT_PATH = certPath;
    process.env.KEY_PATH = '';
    process.env.CA_PATH = caPath;
    expect(() => MtlsAgentHelper.createAgentFromEnv()).toThrow(MtlsAgentValidationError);
    try {
      MtlsAgentHelper.createAgentFromEnv();
    } catch (e: any) {
      expect(e.errors.keyPathMissing).toBe(true);
      expect(e.errors.details).toContain('KEY_PATH environment variable is missing.');
    }
  });

  it('throws error if CA_PATH is missing', () => {
    process.env.CERT_PATH = certPath;
    process.env.KEY_PATH = keyPath;
    process.env.CA_PATH = '';
    expect(() => MtlsAgentHelper.createAgentFromEnv()).toThrow(MtlsAgentValidationError);
    try {
      MtlsAgentHelper.createAgentFromEnv();
    } catch (e: any) {
      expect(e.errors.caPathMissing).toBe(true);
      expect(e.errors.details).toContain('CA_PATH environment variable is missing.');
    }
  });

  it('throws error if cert file does not exist', () => {
    process.env.CERT_PATH = certPath + '-notfound';
    process.env.KEY_PATH = keyPath;
    process.env.CA_PATH = caPath;
    expect(() => MtlsAgentHelper.createAgentFromEnv()).toThrow(MtlsAgentValidationError);
    try {
      MtlsAgentHelper.createAgentFromEnv();
    } catch (e: any) {
      expect(e.errors.certFileMissing).toBe(true);
      expect(e.errors.details[0]).toMatch(/Certificate file not found/);
    }
  });

  it('throws error if key file does not exist', () => {
    process.env.CERT_PATH = certPath;
    process.env.KEY_PATH = keyPath + '-notfound';
    process.env.CA_PATH = caPath;
    expect(() => MtlsAgentHelper.createAgentFromEnv()).toThrow(MtlsAgentValidationError);
    try {
      MtlsAgentHelper.createAgentFromEnv();
    } catch (e: any) {
      expect(e.errors.keyFileMissing).toBe(true);
      expect(e.errors.details[0]).toMatch(/Key file not found/);
    }
  });

  it('throws error if ca file does not exist', () => {
    process.env.CERT_PATH = certPath;
    process.env.KEY_PATH = keyPath;
    process.env.CA_PATH = caPath + '-notfound';
    expect(() => MtlsAgentHelper.createAgentFromEnv()).toThrow(MtlsAgentValidationError);
    try {
      MtlsAgentHelper.createAgentFromEnv();
    } catch (e: any) {
      expect(e.errors.caFileMissing).toBe(true);
      expect(e.errors.details[0]).toMatch(/CA file not found/);
    }
  });

  it('throws error if file cannot be read', () => {
    // Simulate file exists but cannot be read
    const badCertPath = path.join(tmpDir, 'bad-cert.pem');
    fs.writeFileSync(badCertPath, '');
    jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => { throw new Error('read error'); });
    process.env.CERT_PATH = badCertPath;
    process.env.KEY_PATH = keyPath;
    process.env.CA_PATH = caPath;
    expect(() => MtlsAgentHelper.createAgentFromEnv()).toThrow(MtlsAgentValidationError);
    jest.restoreAllMocks();
  });

  it('returns https.Agent if all files and env vars are valid', () => {
    process.env.CERT_PATH = certPath;
    process.env.KEY_PATH = keyPath;
    process.env.CA_PATH = caPath;
    const agent = MtlsAgentHelper.createAgentFromEnv();
    expect(agent).toBeInstanceOf(https.Agent);
  });
});
