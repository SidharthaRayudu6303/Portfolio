import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as path from 'node:path';
import * as fs from 'node:fs';

// Automatically load local .env if present and environment variables are unset
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(envPath);
  } catch {
    // Ignore if already loaded or partially defined
  }
}

const prisma = new PrismaClient();
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ FATAL: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are mandatory.');
    process.exit(1);
  }

  if (!STRONG_PASSWORD_REGEX.test(password)) {
    console.error(
      '❌ FATAL: ADMIN_PASSWORD must be at least 12 characters and include uppercase, lowercase, numbers, and symbols.',
    );
    process.exit(1);
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      role: 'admin',
      tokenVersion: 1,
    },
  });

  console.log(`✅ Admin account successfully seeded for: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
