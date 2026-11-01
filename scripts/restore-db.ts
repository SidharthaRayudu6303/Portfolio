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

const fileBuffer = fs.readFileSync(inputFile);
const iv = fileBuffer.subarray(0, 12);
const authTag = fileBuffer.subarray(fileBuffer.length - 16);
const ciphertext = fileBuffer.subarray(12, fileBuffer.length - 16);

const key = crypto.createHash('sha256').update(BACKUP_ENCRYPTION_KEY).digest();
const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
decipher.setAuthTag(authTag);

const gunzip = createGunzip();
const psql = spawn('psql', [DIRECT_URL]);

psql.stdin.on('error', (err) => console.error('psql error:', err));
psql.on('close', (code) => console.log(`Restoration completed with exit code: ${code}`));

decipher.pipe(gunzip).pipe(psql.stdin);
decipher.write(ciphertext);
decipher.end();
