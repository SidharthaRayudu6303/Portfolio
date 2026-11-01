import { spawn } from 'node:child_process';
import { createGunzip } from 'node:zlib';
import crypto from 'node:crypto';
import fs from 'node:fs';

const DIRECT_URL = process.env.DIRECT_URL;
const BACKUP_ENCRYPTION_KEY = process.env.BACKUP_ENCRYPTION_KEY;
const inputFile = process.argv[2] || 'backup.sql.gz.enc';

if (!DIRECT_URL || !BACKUP_ENCRYPTION_KEY) {
  console.error('FATAL: DIRECT_URL and BACKUP_ENCRYPTION_KEY are mandatory.');
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`FATAL: Backup file "${inputFile}" does not exist.`);
  process.exit(1);
}

const fileBuffer = fs.readFileSync(inputFile);
if (fileBuffer.length < 28) {
  console.error('FATAL: Corrupted backup file: insufficient byte length for GCM IV and auth tag.');
  process.exit(1);
}

const iv = fileBuffer.subarray(0, 12);
const authTag = fileBuffer.subarray(fileBuffer.length - 16);
const ciphertext = fileBuffer.subarray(12, fileBuffer.length - 16);

const key = crypto.createHash('sha256').update(BACKUP_ENCRYPTION_KEY).digest();
const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
decipher.setAuthTag(authTag);

// Pre-authentication check: verify HMAC/GCM integrity BEFORE piping any data to the database
let decryptedGzip: Buffer;
try {
  decryptedGzip = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
} catch (err: any) {
  console.error('❌ FATAL: Backup authentication failed! Invalid encryption key or tampered/corrupted backup file.');
  console.error(`Detail: ${err.message}`);
  process.exit(1);
}

console.log('✅ Backup authentication tag verified. Decryption successful.');

const gunzip = createGunzip();
const psql = spawn('psql', [DIRECT_URL]);

let stderrData = '';
psql.stderr.on('data', (chunk) => {
  stderrData += chunk.toString();
});

psql.on('error', (err) => {
  console.error(`❌ Failed to spawn psql process: ${err.message}`);
  process.exit(1);
});

gunzip.on('error', (err) => {
  console.error(`❌ Gunzip decompression error: ${err.message}`);
  process.exit(1);
});

psql.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Restoration failed with exit code ${code}: ${stderrData}`);
    process.exit(1);
  }
  console.log('✅ Database restoration completed successfully with exit code 0.');
});

gunzip.pipe(psql.stdin);
gunzip.end(decryptedGzip);
