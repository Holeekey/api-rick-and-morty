-- CreateTable
CREATE TABLE "Appearance" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "initMinute" INTEGER NOT NULL,
    "initSecond" INTEGER NOT NULL,
    "finishMinute" INTEGER NOT NULL,
    "finishSecond" INTEGER NOT NULL,

    CONSTRAINT "Appearance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Appearance" ADD CONSTRAINT "Appearance_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appearance" ADD CONSTRAINT "Appearance_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
