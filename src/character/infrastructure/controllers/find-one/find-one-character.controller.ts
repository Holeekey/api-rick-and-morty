import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FindOneCharacterResponse } from './types/find-one-character.response';
import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { CHARACTER_PREFIX, CHARACTER_API_TAG } from '../prefix';
import { ApiTags } from '@nestjs/swagger';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { FindOneCharacterQuery } from 'src/character/application/queries/find-one/find-one-character.query';
import { CharacterRepositoryPostgres } from '../../repositories/postgres/chatacter.repository';
import { SpeciesRepositoryPostgres } from '../../repositories/postgres/species.repository';
import { CharacterStatusRepositoryPostgres } from '../../repositories/postgres/status.repository';

@ApiTags(CHARACTER_API_TAG)
@Controller(CHARACTER_PREFIX)
export class FindOneCharacterController
  implements ControllerContract<[param: string], FindOneCharacterResponse>
{
  constructor(
    private characterRepository: CharacterRepositoryPostgres,
    private speciesRepository: SpeciesRepositoryPostgres,
    private statusRepository: CharacterStatusRepositoryPostgres,
  ) {}

  @Get(':id')
  async execute(
    @Param('id', ParseUUIDPipe) param: string,
  ): Promise<FindOneCharacterResponse> {
    const result = await new ErrorDecorator(
      new FindOneCharacterQuery(
        this.characterRepository,
        this.speciesRepository,
        this.statusRepository,
      ),
      (e) => new HttpException(e.message, 400),
    ).execute({
      id: param,
    });

    const character = result.unwrap();

    const baseUrl = process.env.APP_HOST + ':' + process.env.APP_PORT + '/api/';

    return {
      id: character.id,
      name: character.name,
      species: character.species,
      status: character.status,
      gender: character.gender,
      createdAt: character.createdAt,
      appearancesUrl: character.appearancesId.map(
        (a) => baseUrl + 'appearance/' + a,
      ),
    };
  }
}
