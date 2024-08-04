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

  private statusMapperToModel(status: string): CharacterStatus {
    return status === 'ACTIVE_C'
      ? CharacterStatus.ACTIVE
      : CharacterStatus.SUSPENDED;
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

    const characters = Promise.all(
      charactersORM.map(async (c) => {
        const statusORMName = (
          await this.prisma.status.findFirst({
            where: { id: c.characterStatusId },
          })
        ).name;

        const status = this.statusMapperToModel(statusORMName);

        const gender = this.genderMapperToModel(c.gender);

        return {
          id: c.id,
          name: c.name,
          status: status,
          createdAt: c.createdAt,
          gender: gender,
          species: (
            await this.prisma.subcategory.findFirst({
              where: { id: c.speciesId },
            })
          ).name,
        } as Character;
      }),
    );

    return characters;
  }

  async getOne(id: string): Promise<Optional<Character>> {
    const characterORM = await this.prisma.character.findUnique({
      where: { id: id },
    });

    const status = (
      await this.prisma.status.findUnique({
        where: { id: characterORM.characterStatusId },
      })
    ).name;

    const species = (
      await this.prisma.subcategory.findUnique({
        where: { id: characterORM.speciesId },
      })
    ).name;

    return {
      id: id,
      name: characterORM.name,
      createdAt: characterORM.createdAt,
      status: this.statusMapperToModel(status),
      species: species,
      gender: this.genderMapperToModel(characterORM.gender),
    };
  }

  async save(character: Character): Promise<Result<Character>> {
    const statusId = (
      await this.prisma.status.findUnique({
        where: { name: this.statusMapperToORM(character.status) },
      })
    ).id;

    const speciesId = (
      await this.prisma.subcategory.upsert({
        where: { name: character.species },
        create: {
          name: character.species,
          categoryId: (
            await this.prisma.category.findUnique({
              where: { name: 'SPECIES' },
            })
          ).id,
        },
        update: {},
      })
    ).id;

    await this.prisma.character.upsert({
      where: {
        id: character.id,
      },
      create: {
        id: character.id,
        name: character.name,
        gender: this.genderMapperToORM(character.gender),
        characterStatusId: statusId,
        speciesId: speciesId,
        createdAt: character.createdAt,
      },
      update: {
        name: character.name,
        gender: this.genderMapperToORM(character.gender),
        characterStatusId: statusId,
        speciesId: speciesId,
        createdAt: character.createdAt,
      },
    });

    return Result.success(character);
  }

  async existsBySpeciesAndStatus(character: Character): Promise<boolean> {
    const possibleSpecies = (
      await this.prisma.subcategory.findUnique({
        where: { name: character.species },
      })
    )?.id;

    const statusId = (
      await this.prisma.status.findUnique({
        where: { name: this.statusMapperToORM(character.status) },
      })
    ).id;

    const possibleCharacter = await this.prisma.character.findFirst({
      where: {
        id: {
          not: character.id,
        },
        name: character.name,
        characterStatusId: statusId,
        speciesId: possibleSpecies,
      },
    });

    return possibleCharacter != undefined;
  }
}
