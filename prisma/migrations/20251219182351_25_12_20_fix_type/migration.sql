-- AlterTable
ALTER TABLE "StreamAlert" ALTER COLUMN "text" SET NOT NULL,
ALTER COLUMN "text" SET DEFAULT 'thank you --user-- for --amount-- THB',
ALTER COLUMN "text" SET DATA TYPE TEXT;
