import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { CreateCharacterDTO } from './dto/dto';
import { CreateCharacterResponse } from 'src/character/application/commands/create/types/response';
import { ConcreteUUIDGenerator } from 'src/common/infrastruture/uuid/concrete.uuid.generator';
import { ConcreteDateProvider } from 'src/common/infrastruture/date/date.provider';
import { CharacterRepositoryPostgres } from '../../repositories/postgres/chatacter.repository';
import { CHARACTER_PREFIX, CHARACTER_API_TAG } from '../prefix';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { CreateCharacterCommand } from 'src/character/application/commands/create/create-character.command';

@ApiTags(CHARACTER_API_TAG)
@Controller(CHARACTER_PREFIX)
export class CreateCharacterController
  implements
    ControllerContract<[body: CreateCharacterDTO], CreateCharacterResponse>
{
  constructor(
    private idGenerator: ConcreteUUIDGenerator,
    private dateProvider: ConcreteDateProvider,
    private characterRepository: CharacterRepositoryPostgres,
  ) {}

  @Post()
  async execute(
    @Body() body: CreateCharacterDTO,
  ): Promise<CreateCharacterResponse> {
    const result = await new ErrorDecorator(
      new CreateCharacterCommand(
        this.idGenerator,
        this.dateProvider,
        this.characterRepository,
      ),
      (e) => new HttpException(e.message, 400),
    ).execute({
      name: body.name,
      gender: body.gender,
      species: body.species,
    });

    return result.unwrap();
  }
}
