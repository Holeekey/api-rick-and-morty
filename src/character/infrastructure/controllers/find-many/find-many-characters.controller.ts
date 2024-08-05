import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindManyCharactersResponse } from './types/find-many-character.response';
import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { FindManyCharactersDTO } from './types/find-many-character.dto';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { FindManyCharactersQuery } from 'src/character/application/queries/find-many/find-many-characters.query';
import { CharacterRepositoryPostgres } from '../../repositories/postgres/chatacter.repository';
import { SpeciesRepositoryPostgres } from '../../repositories/postgres/species.repository';
import { CharacterStatusRepositoryPostgres } from '../../repositories/postgres/status.repository';
import { CHARACTER_PREFIX, CHARACTER_API_TAG } from '../prefix';

@ApiTags(CHARACTER_API_TAG)
@Controller(CHARACTER_PREFIX)
export class FindManyCharactersController
  implements
    ControllerContract<
      [query: FindManyCharactersDTO],
      FindManyCharactersResponse
    >
{
  constructor(
    private characterRepository: CharacterRepositoryPostgres,
    private speciesRepository: SpeciesRepositoryPostgres,
    private statusRepository: CharacterStatusRepositoryPostgres,
  ) {}

  @Get()
  async execute(
    @Query() query: FindManyCharactersDTO,
  ): Promise<FindManyCharactersResponse> {
    const result = await new ErrorDecorator(
      new FindManyCharactersQuery(
        this.characterRepository,
        this.speciesRepository,
        this.statusRepository,
      ),
      (e) => new HttpException(e.message, 400),
    ).execute({
      page: query.page,
      perPage: 5,
      species: query.species,
      status: query.status,
    });

    const count = await this.characterRepository.count(
      query.species,
      query.status,
    );

    const pages = Math.ceil(count / 5);

    const nextPage = query.page + 1;
    const prevPage = query.page - 1;

    const baseUrl =
      process.env.APP_HOST + ':' + process.env.APP_PORT + '/api/character/';

    const pageQuery = '?page';

    const speciesQuery = query.species ? '&species=' + query.species : '';
    const statusQuery = query.status ? '&status=' + query.status : '';

    const characters = result.unwrap();

    return {
      info: {
        count: count,
        pages: pages,
        next:
          nextPage >= pages
            ? null
            : baseUrl +
              pageQuery +
              (query.page + 1) +
              speciesQuery +
              statusQuery,
        prev:
          prevPage <= 0
            ? null
            : baseUrl +
              pageQuery +
              (query.page - 1) +
              speciesQuery +
              statusQuery,
      },
      results: characters.map((c) => {
        return {
          id: c.id,
          name: c.name,
          species: c.species,
          status: c.status,
          gender: c.gender,
          createdAt: c.createdAt,
          url: baseUrl + c.id,
        };
      }),
    };
  }
}
