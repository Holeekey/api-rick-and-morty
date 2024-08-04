/*
  Warnings:

  - Added the required column `characterStatusId` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speciesId` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `Character` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "characterStatusId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "speciesId" TEXT NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aireDate" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "epsiodeStatusId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "minutesDuration" INTEGER NOT NULL,
    "secondsDuration" INTEGER NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_characterStatusId_fkey" FOREIGN KEY ("characterStatusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_epsiodeStatusId_fkey" FOREIGN KEY ("epsiodeStatusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
