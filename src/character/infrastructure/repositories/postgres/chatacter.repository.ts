import { Injectable } from '@nestjs/common';
import { Gender as GenderORM } from '@prisma/client';
import {
  Character,
  CharacterStatus,
  Gender,
} from 'src/character/application/models/character';
import { CharacterRepository } from 'src/character/application/repositories/character.repository';
import { Optional } from 'src/common/application/optional/optional';
import { Result } from 'src/common/application/result-handler/result.handler';
import { PrismaService } from 'src/common/infrastruture/database/database.connection.service';

@Injectable()
export class CharacterRepositoryPostgres implements CharacterRepository {
  constructor(private prisma: PrismaService) {}

  async count(species?: string, status?: CharacterStatus): Promise<number> {
    let statusId;
    let speciesId;

    if (species && status) {
      speciesId = (
        await this.prisma.subcategory.findUnique({ where: { name: species } })
      ).id;

      statusId = (
        await this.prisma.status.findUnique({
          where: { name: this.statusMapperToORM(status) },
        })
      ).id;

      return await this.prisma.character.count({
        where: {
          speciesId: speciesId,
          characterStatusId: statusId,
        },
      });
    }

    if (species) {
      speciesId = (
        await this.prisma.subcategory.findUnique({ where: { name: species } })
      ).id;

      return await this.prisma.character.count({
        where: {
          speciesId: speciesId,
        },
      });
    }

    if (status) {
      console.log();
      statusId = (
        await this.prisma.status.findUnique({
          where: { name: this.statusMapperToORM(status) },
        })
      ).id;
      return await this.prisma.character.count({
        where: {
          characterStatusId: statusId,
        },
      });
    }

    const count = await this.prisma.character.count();

    return count;
  }

  private statusMapperToORM(status: CharacterStatus): string {
    return status === CharacterStatus.ACTIVE ? 'ACTIVE_C' : 'SUSPENDED';
  }

  private genderMapperToModel(gender: GenderORM): Gender {
    return gender === GenderORM.FEMALE
      ? Gender.FEMALE
      : gender === GenderORM.MALE
        ? Gender.MALE
        : gender === GenderORM.GENDERLESS
          ? Gender.GENDERLESS
          : Gender.UNKNOWN;
  }

  private genderMapperToORM(gender: Gender): GenderORM {
    return gender === Gender.FEMALE
      ? GenderORM.FEMALE
      : gender === Gender.MALE
        ? GenderORM.MALE
        : gender === Gender.GENDERLESS
          ? GenderORM.GENDERLESS
          : GenderORM.UNKNOWN;
  }

  async getMany(
    page: number,
    perPage: number,
    speciesId?: string,
    statusId?: string,
  ): Promise<Character[]> {
    const charactersORM = await this.prisma.character.findMany({
      where: {
        speciesId: speciesId,
        characterStatusId: statusId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    const characters = charactersORM.map((c) => {
      const gender = this.genderMapperToModel(c.gender);

      return {
        id: c.id,
        name: c.name,
        statusId: c.characterStatusId,
        createdAt: c.createdAt,
        gender: gender,
        speciesId: c.speciesId,
      } as Character;
    });

    return characters;
  }

  async getOne(id: string): Promise<Optional<Character>> {
    const characterORM = await this.prisma.character.findUnique({
      where: { id: id },
    });

    return {
      id: id,
      name: characterORM.name,
      createdAt: characterORM.createdAt,
      statusId: characterORM.characterStatusId,
      speciesId: characterORM.speciesId,
      gender: this.genderMapperToModel(characterORM.gender),
    };
  }

  async save(character: Character): Promise<Result<Character>> {
    await this.prisma.character.upsert({
      where: {
        id: character.id,
      },
      create: {
        id: character.id,
        name: character.name,
        gender: this.genderMapperToORM(character.gender),
        characterStatusId: character.statusId,
        speciesId: character.speciesId,
        createdAt: character.createdAt,
      },
      update: {
        name: character.name,
        gender: this.genderMapperToORM(character.gender),
        characterStatusId: character.statusId,
        speciesId: character.speciesId,
        createdAt: character.createdAt,
      },
    });

    return Result.success(character);
  }

  async existsBySpeciesAndStatus(character: Character): Promise<boolean> {
    const possibleCharacter = await this.prisma.character.findFirst({
      where: {
        id: {
          not: character.id,
        },
        name: character.name,
        characterStatusId: character.statusId,
        speciesId: character.speciesId,
      },
    });

    return possibleCharacter != undefined;
  }
}
