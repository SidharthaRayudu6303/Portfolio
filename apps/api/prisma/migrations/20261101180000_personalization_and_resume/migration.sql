-- AlterTable
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "problemSolved" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "myContribution" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "whyBuilt" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "features" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'In Development';

-- AlterTable
ALTER TABLE "Experience" ALTER COLUMN "startDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Certification" ALTER COLUMN "issueDate" DROP NOT NULL;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Education" (
    "id" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER NOT NULL,
    "cgpa" TEXT NOT NULL,
    "coursework" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "year" INTEGER,
    "status" TEXT,
    "projectUrl" TEXT,
    "proofUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ResumeDocument" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'Resume',
    "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
    "fileSize" INTEGER NOT NULL,
    "fileData" BYTEA NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProfileSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProfileMedia" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'image/png',
    "fileSize" INTEGER NOT NULL,
    "fileData" BYTEA NOT NULL,
    "imageUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ResumeDocument_isActive_createdAt_idx" ON "ResumeDocument"("isActive", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ProfileSetting_key_key" ON "ProfileSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ProfileMedia_type_key" ON "ProfileMedia"("type");

