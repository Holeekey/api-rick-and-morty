import { CharacterRepository } from 'src/appearance/application/repositories/character.repository';
import { PrismaService } from 'src/common/infrastruture/database/database.connection.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CharacterRepositoryByAppearancePostgres
  implements CharacterRepository
{
  constructor(private prisma: PrismaService) {}

  async existsById(id: string): Promise<boolean> {
    const character = await this.prisma.character.findUnique({
      where: { id: id },
    });
    return character != undefined;
  }
}
