import { spawn } from 'node:child_process';
import { createGzip } from 'node:zlib';
import crypto from 'node:crypto';
import fs from 'node:fs';

const DIRECT_URL = process.env.DIRECT_URL;
const BACKUP_ENCRYPTION_KEY = process.env.BACKUP_ENCRYPTION_KEY;

if (!DIRECT_URL || !BACKUP_ENCRYPTION_KEY || BACKUP_ENCRYPTION_KEY.length < 32) {
  console.error('FATAL: DIRECT_URL and 32-char BACKUP_ENCRYPTION_KEY are mandatory.');
  process.exit(1);
}

const key = crypto.createHash('sha256').update(BACKUP_ENCRYPTION_KEY).digest();
const iv = crypto.randomBytes(12); // Standard 96-bit GCM IV
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

const outputFile = 'backup.sql.gz.enc';
const outputStream = fs.createWriteStream(outputFile);

// Write 12-byte IV at file head
outputStream.write(iv);

const pgDump = spawn('pg_dump', [DIRECT_URL, '--clean', '--if-exists']);
const gzip = createGzip();

pgDump.stdout.pipe(gzip).pipe(cipher).pipe(outputStream, { end: false });

cipher.on('end', () => {
  const authTag = cipher.getAuthTag(); // 16-byte GCM authentication tag
  outputStream.write(authTag);
  outputStream.end();
  console.log(`Authenticated database backup generated: ${outputFile}`);
});
