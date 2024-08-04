import { DeleteCharacterResponse } from 'src/character/application/commands/delete/types/response';
import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { CHARACTER_PREFIX, CHARACTER_API_TAG } from '../prefix';
import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Delete,
  HttpException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { DeleteCharacterCommand } from 'src/character/application/commands/delete/delete-character.command';
import { CharacterRepositoryPostgres } from '../../repositories/postgres/chatacter.repository';

@ApiTags(CHARACTER_API_TAG)
@Controller(CHARACTER_PREFIX)
export class DeleteCharacterController
  implements ControllerContract<[param: string], DeleteCharacterResponse>
{
  constructor(private characterRepository: CharacterRepositoryPostgres) {}

  @Delete(':id')
  async execute(
    @Param('id', ParseUUIDPipe) param: string,
  ): Promise<DeleteCharacterResponse> {
    const result = await new ErrorDecorator(
      new DeleteCharacterCommand(this.characterRepository),
      (e) => new HttpException(e.message, 400),
    ).execute({ id: param });

    return result.unwrap();
  }
}
