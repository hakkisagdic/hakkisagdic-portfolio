-- CreateTable
CREATE TABLE "Highlight" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id")
);

-- AlterTable Education: add showDates column
ALTER TABLE "Education" ADD COLUMN IF NOT EXISTS "showDates" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable Education: make startDate optional
ALTER TABLE "Education" ALTER COLUMN "startDate" DROP NOT NULL;
