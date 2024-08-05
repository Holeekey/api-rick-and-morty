import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { CreateAppearanceDTO } from './dto/create-appearance.dto';
import { CreateAppearanceResponse } from 'src/appearance/application/commands/create/types/response';
import { ConcreteUUIDGenerator } from 'src/common/infrastruture/uuid/concrete.uuid.generator';
import { AppearanceRepositoryPostgres } from '../../repositories/postgres/appearance.repository';
import { CharacterRepositoryByAppearancePostgres } from '../../repositories/postgres/character.repository';
import { EpisodeRepositoryByAppearancePostgres } from '../../repositories/postgres/episode.repository';
import { APPEARANCE_API_TAG, APPEARANCE_PREFIX } from '../prefix';
import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { CreateAppearanceCommand } from 'src/appearance/application/commands/create/create-appearance.command';

@ApiTags(APPEARANCE_API_TAG)
@Controller(APPEARANCE_PREFIX)
export class CreateAppearanceController
  implements
    ControllerContract<[body: CreateAppearanceDTO], CreateAppearanceResponse>
{
  constructor(
    private idGenerator: ConcreteUUIDGenerator,
    private appearanceRepository: AppearanceRepositoryPostgres,
    private characterRepository: CharacterRepositoryByAppearancePostgres,
    private episodeRepository: EpisodeRepositoryByAppearancePostgres,
  ) {}

  @Post()
  async execute(
    @Body() body: CreateAppearanceDTO,
  ): Promise<CreateAppearanceResponse> {
    const result = await new ErrorDecorator(
      new CreateAppearanceCommand(
        this.idGenerator,
        this.appearanceRepository,
        this.episodeRepository,
        this.characterRepository,
      ),
      (e) => new HttpException(e.message, 400),
    ).execute({
      characterId: body.characterId,
      episodeId: body.episodeId,
      initMinute: body.initMinute,
      initSecond: body.initSecond,
      finishMinute: body.finishMinute,
      finishSecond: body.finishSecond,
    });

    return result.unwrap();
  }
}
