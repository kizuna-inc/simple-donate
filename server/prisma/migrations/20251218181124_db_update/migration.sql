-- CreateTable
CREATE TABLE "StreamAlert" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'static/upload/cdn/alert.gif',
    "sound" TEXT NOT NULL DEFAULT 'static/upload/cdn/alert.mp3',
    "text" TEXT[] DEFAULT ARRAY['Thank you', 'for']::TEXT[],
    "create_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StreamAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamConfig" (
    "id" SERIAL NOT NULL,
    "min_amount" INTEGER NOT NULL DEFAULT 10,
    "banking_order" INTEGER[],
    "create_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StreamConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomGift" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "create_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomGift_pkey" PRIMARY KEY ("id")
);
