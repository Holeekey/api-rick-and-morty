import { Injectable } from '@nestjs/common';
import { Optional } from 'src/common/application/optional/optional';
import { PrismaService } from 'src/common/infrastruture/database/database.connection.service';
import { EpisodeStatus } from 'src/episode/application/models/episode';
import { EpisodeStatus as EpisodeStatusModel } from 'src/episode/application/models/status';
import { EpisodeStatusRepository } from 'src/episode/application/repositories/status.repository';

@Injectable()
export class EpisodeStatusRepositoryPostgres
  implements EpisodeStatusRepository
{
  constructor(private prisma: PrismaService) {}

  private statusMapperToModel(status: string): EpisodeStatus {
    return status === 'ACTIVE_E'
      ? EpisodeStatus.ACTIVE
      : EpisodeStatus.CANCELLED;
  }

  private statusMapperToORM(status: EpisodeStatus): string {
    return status === EpisodeStatus.ACTIVE ? 'ACTIVE_E' : 'CANCELLED';
  }

  async getById(id: string): Promise<Optional<EpisodeStatusModel>> {
    const episodeStatusId = (
      await this.prisma.statusType.findUnique({
        where: {
          name: 'EPISODES',
        },
      })
    ).id;

    const status = await this.prisma.status.findUnique({
      where: {
        id: id,
        statusTypeId: episodeStatusId,
      },
    });

    return {
      id: status.id,
      name: this.statusMapperToModel(status.name),
    };
  }
  async getByName(name: EpisodeStatus): Promise<Optional<EpisodeStatusModel>> {
    const episodeStatusId = (
      await this.prisma.statusType.findUnique({
        where: {
          name: 'EPISODES',
        },
      })
    ).id;

    const status = await this.prisma.status.findUnique({
      where: {
        name: this.statusMapperToORM(name),
        statusTypeId: episodeStatusId,
      },
    });

    return {
      id: status.id,
      name: this.statusMapperToModel(status.name),
    };
  }
}
