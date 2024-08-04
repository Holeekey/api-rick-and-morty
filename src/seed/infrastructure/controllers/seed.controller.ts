import { HttpService } from '@nestjs/axios';
import { Controller, Post } from '@nestjs/common';
import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { PrismaService } from 'src/common/infrastruture/database/database.connection.service';
import { CharacterResponse } from './types/character-response/api-character.response';
import { ConcreteUUIDGenerator } from 'src/common/infrastruture/uuid/concrete.uuid.generator';
import { Gender } from '@prisma/client';
import { EpisodeResponse } from './types/episode-response/api-episode.response';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController implements ControllerContract<[], any> {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private idGenerator: ConcreteUUIDGenerator,
  ) {}

  @Post()
  async execute(): Promise<any> {
    const characterStatusId = this.idGenerator.generate();
    const episodesStatusId = this.idGenerator.generate();

    await this.prisma.statusType.createMany({
      data: [
        {
          id: characterStatusId,
          name: 'CHARACTER',
        },
        {
          id: episodesStatusId,
          name: 'EPISODES',
        },
      ],
      skipDuplicates: true,
    });

    const activeCharacterStatusId = this.idGenerator.generate();
    const suspendedCharacterStatusId = this.idGenerator.generate();
    const activeEpisodeStatusId = this.idGenerator.generate();
    const cancelledEpisodeStatusId = this.idGenerator.generate();

    await this.prisma.status.createMany({
      data: [
        {
          id: activeCharacterStatusId,
          name: 'ACTIVE_C',
          statusTypeId: characterStatusId,
        },
        {
          id: suspendedCharacterStatusId,
          name: 'SUSPENDED',
          statusTypeId: characterStatusId,
        },
        {
          id: activeEpisodeStatusId,
          name: 'ACTIVE_E',
          statusTypeId: episodesStatusId,
        },
        {
          id: cancelledEpisodeStatusId,
          name: 'CANCELLED',
          statusTypeId: episodesStatusId,
        },
      ],
      skipDuplicates: true,
    });

    const speciesCategoryId = this.idGenerator.generate();
    const seasonCategoryId = this.idGenerator.generate();

    await this.prisma.category.createMany({
      data: [
        {
          id: speciesCategoryId,
          name: 'SPECIES',
        },
        {
          id: seasonCategoryId,
          name: 'SEASON',
        },
      ],
      skipDuplicates: true,
    });

    const characterUri = 'https://rickandmortyapi.com/api/character/';
    let characterId = 1;

    let allCharactersSeeded = false;

    const genderMap = new Map<string, Gender>([
      ['Male', Gender.MALE],
      ['Female', Gender.FEMALE],
      ['Genderless', Gender.GENDERLESS],
      ['unknown', Gender.UNKNOWN],
    ]);

    try {
      while (!allCharactersSeeded) {
        const apiCharacter: CharacterResponse = (
          await this.httpService.axiosRef.get(characterUri + characterId)
        ).data;

        if (!apiCharacter.id) {
          allCharactersSeeded = true;
        } else {
          characterId = characterId + 1;

          const apiGender = apiCharacter.gender;

          const characterSpecies = apiCharacter.species;

          const possibleSpecies = await this.prisma.subcategory.findUnique({
            where: {
              name: characterSpecies,
            },
          });

          let speciesId: string;

          if (possibleSpecies) {
            speciesId = possibleSpecies.id;
          } else {
            speciesId = this.idGenerator.generate();
            await this.prisma.subcategory.create({
              data: {
                id: speciesId,
                name: characterSpecies,
                categoryId: speciesCategoryId,
              },
            });
          }

          await this.prisma.character.create({
            data: {
              id: this.idGenerator.generate(),
              name: apiCharacter.name,
              gender: genderMap.get(apiGender),
              characterStatusId: activeCharacterStatusId,
              speciesId: speciesId,
            },
          });
        }
      }
    } catch (error) {}

    let episodeId = 1;

    let allEpisodesSeeded = false;

    const episodeUri = 'https://rickandmortyapi.com/api/episode/';

    try {
      while (!allEpisodesSeeded) {
        const apiEpisode: EpisodeResponse = (
          await this.httpService.axiosRef.get(episodeUri + episodeId)
        ).data;

        if (!apiEpisode.id) {
          allEpisodesSeeded = true;
        } else {
          episodeId = episodeId + 1;

          const apiSeason = apiEpisode.episode.slice(0, 3);

          const possibleSeason = await this.prisma.subcategory.findUnique({
            where: {
              name: apiSeason,
            },
          });

          let seasonId: string;

          if (possibleSeason) {
            seasonId = possibleSeason.id;
          } else {
            seasonId = this.idGenerator.generate();
            await this.prisma.subcategory.create({
              data: {
                id: seasonId,
                name: apiSeason,
                categoryId: seasonCategoryId,
              },
            });
          }

          await this.prisma.episode.create({
            data: {
              id: this.idGenerator.generate(),
              name: apiEpisode.name,
              code: apiEpisode.episode,
              seasonId: seasonId,
              aireDate: new Date(apiEpisode.air_date),
              minutesDuration: 0,
              secondsDuration: 0,
              epsiodeStatusId: activeEpisodeStatusId,
            },
          });
        }
      }
    } catch (error) {}

    return { message: 'SEED EXECUTED' };
  }
}
