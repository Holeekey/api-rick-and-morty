import { PrismaService } from 'src/common/infrastruture/database/database.connection.service';
import { Episode } from '../../application/models/episode';
import { EpisodeRepository } from '../../application/repositories/episode.repository';
import { Optional } from 'src/common/application/optional/optional';
import { Result } from 'src/common/application/result-handler/result.handler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EpisodeRepositoryPostgres implements EpisodeRepository {
  constructor(private prisma: PrismaService) {}

  async upsertSeason(season: string) {
    await this.prisma.subcategory.upsert({
      where: {
        name: season,
      },
      create: {
        name: season,
        categoryId: (
          await this.prisma.category.findUnique({
            where: { name: 'SEASON' },
          })
        ).id,
      },
      update: {},
    });
  }

  async getMany(
    page: number,
    perPage: number,
    seasonId?: string,
    statusId?: string,
  ): Promise<Episode[]> {
    const episodesORM = await this.prisma.episode.findMany({
      where: {
        seasonId: seasonId,
        epsiodeStatusId: statusId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        aireDate: 'asc',
      },
    });

    const episodes = episodesORM.map(
      (e) =>
        ({
          id: e.id,
          name: e.name,
          aireDate: e.aireDate,
          code: e.code,
          minutesDuration: e.minutesDuration,
          secondsDuration: e.secondsDuration,
          seasonId: e.seasonId,
          statusId: e.epsiodeStatusId,
        }) as Episode,
    );

    return episodes;
  }
  async getOne(id: string): Promise<Optional<Episode>> {
    const episode = await this.prisma.episode.findUnique({ where: { id: id } });

    if (!episode) return undefined;

    return {
      id: episode.id,
      name: episode.name,
      code: episode.code,
      aireDate: episode.aireDate,
      seasonId: episode.seasonId,
      statusId: episode.epsiodeStatusId,
      minutesDuration: episode.minutesDuration,
      secondsDuration: episode.secondsDuration,
    };
  }
  async save(episode: Episode): Promise<Result<Episode>> {
    await this.prisma.episode.upsert({
      where: {
        id: episode.id,
      },
      create: {
        id: episode.id,
        name: episode.name,
        code: episode.code,
        seasonId: episode.seasonId,
        epsiodeStatusId: episode.statusId,
        aireDate: episode.aireDate,
        minutesDuration: episode.minutesDuration,
        secondsDuration: episode.secondsDuration,
      },
      update: {
        name: episode.name,
        code: episode.code,
        seasonId: episode.seasonId,
        epsiodeStatusId: episode.statusId,
        aireDate: episode.aireDate,
        minutesDuration: episode.minutesDuration,
        secondsDuration: episode.secondsDuration,
      },
    });
    return Result.success(episode);
  }
  async existsBySeason(episode: Episode): Promise<boolean> {
    const possibleEpisode = await this.prisma.episode.findFirst({
      where: {
        id: {
          not: episode.id,
        },
        name: episode.name,
        seasonId: episode.seasonId,
      },
    });

    return possibleEpisode != undefined;
  }
}
