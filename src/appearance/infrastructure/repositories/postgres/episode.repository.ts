import { Episode } from 'src/appearance/application/models/episode';
import { EpisodeRepository } from 'src/appearance/application/repositories/episode.repository';
import { Optional } from 'src/common/application/optional/optional';
import { PrismaService } from 'src/common/infrastruture/database/database.connection.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EpisodeRepositoryByAppearancePostgres
  implements EpisodeRepository
{
  constructor(private prisma: PrismaService) {}

  async getById(id: string): Promise<Optional<Episode>> {
    const episode = await this.prisma.episode.findUnique({
      where: {
        id: id,
      },
    });

    if (!episode) {
      return undefined;
    }
    return {
      id: id,
      minutesDuration: episode.minutesDuration,
      secondsDuration: episode.secondsDuration,
    } as Episode;
  }
}
