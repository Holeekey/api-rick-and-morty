import { Injectable } from '@nestjs/common';
import { Species } from 'src/character/application/models/species';
import { SpeciesRepository } from 'src/character/application/repositories/species.repository';
import { Optional } from 'src/common/application/optional/optional';
import { Result } from 'src/common/application/result-handler/result.handler';
import { PrismaService } from 'src/common/infrastruture/database/database.connection.service';

@Injectable()
export class SpeciesRepositoryPostgres implements SpeciesRepository {
  constructor(private prisma: PrismaService) {}

  async upsert(name: string): Promise<Result<Species>> {
    const speciesCategoryId = (
      await this.prisma.category.findFirst({
        where: { name: 'SPECIES' },
      })
    ).id;

    const species = await this.prisma.subcategory.upsert({
      where: {
        name: name,
        categoryId: speciesCategoryId,
      },
      create: {
        name: name,
        categoryId: speciesCategoryId,
      },
      update: {},
    });

    return Result.success({
      id: species.id,
      name: species.name,
    });
  }

  async getById(id: string): Promise<Optional<Species>> {
    const speciesCategoryId = (
      await this.prisma.category.findFirst({
        where: { name: 'SPECIES' },
      })
    ).id;

    const species = await this.prisma.subcategory.findUnique({
      where: {
        id: id,
        categoryId: speciesCategoryId,
      },
    });

    if (!species) {
      return undefined;
    }

    return {
      id: species.id,
      name: species.name,
    };
  }

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
