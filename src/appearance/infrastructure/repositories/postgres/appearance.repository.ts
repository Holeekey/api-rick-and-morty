import { Injectable } from '@nestjs/common';
import { Appearance } from 'src/appearance/application/models/appearance';
import { AppearanceRepository } from 'src/appearance/application/repositories/appearance.repository';
import { firstTimeLapseInsideSecond } from 'src/appearance/application/utils/time-laps-overlap';
import { TimeLapse } from 'src/appearance/application/utils/types/time-lapse';
import { Optional } from 'src/common/application/optional/optional';
import { Result } from 'src/common/application/result-handler/result.handler';
import { PrismaService } from 'src/common/infrastruture/database/database.connection.service';

@Injectable()
export class AppearanceRepositoryPostgres implements AppearanceRepository {
  constructor(private prisma: PrismaService) {}
  async getMany(
    page: number,
    perPage: number,
    episodeId?: string,
    characterId?: string,
    seasonId?: string,
    episodeStatusId?: string,
    characterStatusId?: string,
  ): Promise<Appearance[]> {
    const appearances = await this.prisma.appearance.findMany({
      where: {
        episodeId: episodeId,
        episode: {
          epsiodeStatusId: episodeStatusId,
          seasonId: seasonId,
        },
        characterId: characterId,
        character: {
          characterStatusId: characterStatusId,
        },
      },
      take: perPage,
      skip: (page - 1) * perPage,
    });
    return appearances.map((a) => {
      return {
        id: a.id,
        characterId: a.characterId,
        episodeId: a.episodeId,
        initMinute: a.initMinute,
        initSecond: a.initSecond,
        finishMinute: a.finishMinute,
        finishSecond: a.finishSecond,
      };
    });
  }

  async getOne(id: string): Promise<Optional<Appearance>> {
    const possibleAppearance = await this.prisma.appearance.findUnique({
      where: { id: id },
    });
    if (!possibleAppearance) {
      return undefined;
    }
    return {
      id: possibleAppearance.id,
      characterId: possibleAppearance.characterId,
      episodeId: possibleAppearance.episodeId,
      initMinute: possibleAppearance.initMinute,
      initSecond: possibleAppearance.initSecond,
      finishMinute: possibleAppearance.finishMinute,
      finishSecond: possibleAppearance.finishSecond,
    };
  }

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
