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

let cleanedUp = false;
function cleanupAndExit(reason: string) {
  if (cleanedUp) return;
  cleanedUp = true;
  console.error(`❌ Backup failed: ${reason}`);
  try {
    outputStream.destroy();
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
  } catch {
    // ignore
  }
  process.exit(1);
}

// Write 12-byte IV at file head
outputStream.write(iv);

const pgDump = spawn('pg_dump', [DIRECT_URL, '--clean', '--if-exists']);
const gzip = createGzip();

let stderrData = '';
pgDump.stderr.on('data', (data) => {
  stderrData += data.toString();
});

pgDump.on('error', (err) => cleanupAndExit(`Failed to spawn pg_dump: ${err.message}`));
gzip.on('error', (err) => cleanupAndExit(`Gzip error: ${err.message}`));
cipher.on('error', (err) => cleanupAndExit(`Cipher error: ${err.message}`));
outputStream.on('error', (err) => cleanupAndExit(`Output stream error: ${err.message}`));

pgDump.stdout.pipe(gzip).pipe(cipher).pipe(outputStream, { end: false });

let cipherEnded = false;
cipher.on('end', () => {
  cipherEnded = true;
  const authTag = cipher.getAuthTag(); // 16-byte GCM authentication tag
  outputStream.write(authTag);
  outputStream.end();
});

pgDump.on('close', (code) => {
  if (code !== 0) {
    cleanupAndExit(`pg_dump exited with error code ${code}: ${stderrData}`);
  }
});

outputStream.on('finish', () => {
  if (cipherEnded && !cleanedUp) {
    console.log(`✅ Authenticated database backup generated: ${outputFile}`);
  }
});
