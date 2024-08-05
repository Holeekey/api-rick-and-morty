import { Injectable } from '@nestjs/common';
import { Appearance } from 'src/appearance/application/models/appearance';
import { AppearanceRepository } from 'src/appearance/application/repositories/appearance.repository';
import { firstTimeLapseInsideSecond } from 'src/appearance/application/utils/time-laps-overlap';
import { TimeLapse } from 'src/appearance/application/utils/types/time-lapse';
import { Result } from 'src/common/application/result-handler/result.handler';
import { PrismaService } from 'src/common/infrastruture/database/database.connection.service';

@Injectable()
export class AppearanceRepositoryPostgres implements AppearanceRepository {
  constructor(private prisma: PrismaService) {}

  async save(appearance: Appearance): Promise<Result<Appearance>> {
    await this.prisma.appearance.upsert({
      where: {
        id: appearance.id,
      },
      create: {
        id: appearance.id,
        episodeId: appearance.episodeId,
        characterId: appearance.characterId,
        initMinute: appearance.initMinute,
        initSecond: appearance.initSecond,
        finishMinute: appearance.finishMinute,
        finishSecond: appearance.finishSecond,
      },
      update: {
        episodeId: appearance.episodeId,
        characterId: appearance.characterId,
        initMinute: appearance.initMinute,
        initSecond: appearance.initSecond,
        finishMinute: appearance.finishMinute,
        finishSecond: appearance.finishSecond,
      },
    });
    return Result.success(appearance);
  }

  async appearanceOverlaps(appearance: Appearance): Promise<boolean> {
    const characterAppearancesOnEpisode = await this.prisma.appearance.findMany(
      {
        where: {
          id: {
            not: appearance.id,
          },
          characterId: appearance.characterId,
          episodeId: appearance.episodeId,
        },
      },
    );

    const newAppearanceTimeLapse: TimeLapse = {
      initMinute: {
        minute: appearance.initMinute,
        second: appearance.initSecond,
      },
      finishMinute: {
        minute: appearance.finishMinute,
        second: appearance.finishSecond,
      },
    };

    console.log(characterAppearancesOnEpisode);

    return characterAppearancesOnEpisode.some((a) => {
      const appearanceTimeLapse: TimeLapse = {
        initMinute: {
          minute: a.initMinute,
          second: a.initSecond,
        },
        finishMinute: {
          minute: a.finishMinute,
          second: a.finishSecond,
        },
      };
      return firstTimeLapseInsideSecond(
        newAppearanceTimeLapse,
        appearanceTimeLapse,
      );
    });
  }
}
