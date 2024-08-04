import { Season } from '../../application/models/season';
import { SeasonRepository } from '../../application/repositories/season.repository';
import { PrismaService } from '../../../common/infrastruture/database/database.connection.service';
import { Optional } from 'src/common/application/optional/optional';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeasonRepositoryPostgres implements SeasonRepository {
  constructor(private prisma: PrismaService) {}

  async getById(id: string): Promise<Optional<Season>> {
    const seasonCategoryId = (
      await this.prisma.category.findUnique({
        where: {
          name: 'SEASON',
        },
      })
    ).id;

    return await this.prisma.subcategory.findUnique({
      where: {
        id: id,
        categoryId: seasonCategoryId,
      },
    });
  }
  async getByName(name: string): Promise<Optional<Season>> {
    const seasonCategoryId = (
      await this.prisma.category.findUnique({
        where: {
          name: 'SEASON',
        },
      })
    ).id;

    return await this.prisma.subcategory.findUnique({
      where: {
        name: name,
        categoryId: seasonCategoryId,
      },
    });
  }
}
