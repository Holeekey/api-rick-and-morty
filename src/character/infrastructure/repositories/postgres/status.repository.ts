import { Injectable } from '@nestjs/common';
import { CharacterStatus } from 'src/character/application/models/character';
import { CharacterStatus as CharacterStatusModel } from 'src/character/application/models/status';
import { CharacterStatusRepository } from 'src/character/application/repositories/status.repository';
import { Optional } from 'src/common/application/optional/optional';
import { PrismaService } from 'src/common/infrastruture/database/database.connection.service';

@Injectable()
export class CharacterStatusRepositoryPostgres
  implements CharacterStatusRepository
{
  constructor(private prisma: PrismaService) {}

  async getByName(
    name: CharacterStatus,
  ): Promise<Optional<CharacterStatusModel>> {
    const nameORM = name === CharacterStatus.ACTIVE ? 'ACTIVE_C' : 'SUSPENDED';

    const status = await this.prisma.status.findFirst({
      where: { name: nameORM },
    });

    return {
      id: status.id,
      name: name,
    };
  }
}
