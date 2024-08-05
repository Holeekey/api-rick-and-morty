import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { UpdateCharacterDTO } from './dto/dto';
import { UpdateCharacterResponse } from 'src/character/application/commands/update/types/response';
import { CHARACTER_PREFIX, CHARACTER_API_TAG } from '../prefix';
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpException,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { CharacterRepositoryPostgres } from '../../repositories/postgres/chatacter.repository';
import { UpdateCharacterCommand } from 'src/character/application/commands/update/update-character.command';
import { SpeciesRepositoryPostgres } from '../../repositories/postgres/species.repository';
import { CharacterStatusRepositoryPostgres } from '../../repositories/postgres/status.repository';

@ApiTags(CHARACTER_API_TAG)
@Controller(CHARACTER_PREFIX)
export class UpdateCharacterController
  implements
    ControllerContract<
      [param: string, body: UpdateCharacterDTO],
      UpdateCharacterResponse
    >
{
  constructor(
    private characterRepository: CharacterRepositoryPostgres,
    private speciesRepository: SpeciesRepositoryPostgres,
    private statusRepository: CharacterStatusRepositoryPostgres,
  ) {}

  @Patch(':id')
  async execute(
    @Param('id', ParseUUIDPipe) param: string,
    @Body() body: UpdateCharacterDTO,
  ): Promise<UpdateCharacterResponse> {
    const result = await new ErrorDecorator(
      new UpdateCharacterCommand(
        this.characterRepository,
        this.speciesRepository,
        this.statusRepository,
      ),
      (e) => new HttpException(e.message, 400),
    ).execute({
      id: param,
      name: body.name,
      gender: body.gender,
      species: body.species,
    });

    return result.unwrap();
  }
}
