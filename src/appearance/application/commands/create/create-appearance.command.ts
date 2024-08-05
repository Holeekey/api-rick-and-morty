import { ApplicationService } from 'src/common/application/service/application.service';
import { CreateAppearanceDTO } from './types/dto';
import { CreateAppearanceResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { AppearanceRepository } from '../../repositories/appearance.repository';
import { EpisodeRepository } from '../../repositories/episode.repository';
import { CharacterRepository } from '../../repositories/character.repository';
import { characterNotFoundError } from '../../errors/character.not.found';
import { episodeNotFoundError } from '../../errors/episode.not.found';
import { firstMinuteGreaterThan } from '../../utils/duration-greater-than';
import { initGreaterThanFinishjError as initGreaterThanFinishError } from '../../errors/init.greater.than.finish';
import { appearanceTimeExceedsDurationError } from '../../errors/appearance.time.exceeds.duration';
import { Appearance } from '../../models/appearance';
import { IDGenerator } from 'src/common/application/ID/ID.generator';
import { appearanceTimeOverlapsError } from '../../errors/appearance.time.overlaps';
import { Minute } from '../../utils/types/minute';

export class CreateAppearanceCommand
  implements ApplicationService<CreateAppearanceDTO, CreateAppearanceResponse>
{
  constructor(
    private idGenerator: IDGenerator<string>,
    private appearanceRepository: AppearanceRepository,
    private episodeRepository: EpisodeRepository,
    private characterRepository: CharacterRepository,
  ) {}

  async execute(
    data: CreateAppearanceDTO,
  ): Promise<Result<CreateAppearanceResponse>> {
    if (!(await this.characterRepository.existsById(data.characterId))) {
      return Result.error(characterNotFoundError());
    }

    const possibleEpisode = await this.episodeRepository.getById(
      data.episodeId,
    );

    if (!possibleEpisode) {
      return Result.error(episodeNotFoundError());
    }

    const episodeDuration: Minute = {
      minute: possibleEpisode.minutesDuration,
      second: possibleEpisode.secondsDuration,
    };

    const initMinute: Minute = {
      minute: data.initMinute,
      second: data.initSecond,
    };

    const finishMinute: Minute = {
      minute: data.finishMinute,
      second: data.finishSecond,
    };

    if (firstMinuteGreaterThan(initMinute, finishMinute)) {
      return Result.error(initGreaterThanFinishError());
    }

    if (firstMinuteGreaterThan(initMinute, episodeDuration)) {
      return Result.error(appearanceTimeExceedsDurationError());
    }

    if (firstMinuteGreaterThan(finishMinute, episodeDuration)) {
      return Result.error(appearanceTimeExceedsDurationError());
    }

    const appearance: Appearance = {
      id: this.idGenerator.generate(),
      characterId: data.characterId,
      episodeId: data.episodeId,
      initMinute: data.initMinute,
      initSecond: data.initSecond,
      finishMinute: data.finishMinute,
      finishSecond: data.finishSecond,
    };

    if (await this.appearanceRepository.appearanceOverlaps(appearance)) {
      return Result.error(appearanceTimeOverlapsError());
    }

    await this.appearanceRepository.save(appearance);

    return Result.success({
      id: appearance.id,
    });
  }
}
