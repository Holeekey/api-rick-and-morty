import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindManyCharactersResponse } from 'src/character/application/queries/find-many/types/response';
import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { FindManyCharactersDTO } from './dto/find-many-character.dto';
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
      FindManyCharactersResponse[]
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
  ): Promise<FindManyCharactersResponse[]> {
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

    return result.unwrap();
  }
}
