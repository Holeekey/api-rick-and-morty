import { Injectable } from '@nestjs/common';
import { Species } from 'src/character/application/models/species';
import { SpeciesRepository } from 'src/character/application/repositories/species.repository';
import { Optional } from 'src/common/application/optional/optional';
import { PrismaService } from 'src/common/infrastruture/database/database.connection.service';

@Injectable()
export class SpeciesRepositoryPostgres implements SpeciesRepository {
  constructor(private prisma: PrismaService) {}

  async getByName(name: string): Promise<Optional<Species>> {
    const speciesCategoryId = (
      await this.prisma.category.findFirst({
        where: { name: 'SPECIES' },
      })
    ).id;

    return await this.prisma.subcategory.findFirst({
      where: { name: name, categoryId: speciesCategoryId },
    });
  }
}
