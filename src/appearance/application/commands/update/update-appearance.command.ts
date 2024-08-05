import { ApplicationService } from 'src/common/application/service/application.service';
import { UpdateAppearanceDTO } from './types/dto';
import { UpdateAppearanceResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { AppearanceRepository } from '../../repositories/appearance.repository';
import { EpisodeRepository } from '../../repositories/episode.repository';
import { CharacterRepository } from '../../repositories/character.repository';
import { characterNotFoundError } from '../../errors/character.not.found';
import { episodeNotFoundError } from '../../errors/episode.not.found';
import { firstMinuteGreaterThan } from '../../utils/duration-greater-than';
import { initGreaterThanFinishjError as initGreaterThanFinishError } from '../../errors/init.greater.than.finish';
import { appearanceTimeExceedsDurationError } from '../../errors/appearance.time.exceeds.duration';
import { appearanceTimeOverlapsError } from '../../errors/appearance.time.overlaps';
import { appearanceNotFoundError } from '../../errors/appearance.not.found';
import { Minute } from '../../utils/types/minute';

export class UpdateAppearanceCommand
  implements ApplicationService<UpdateAppearanceDTO, UpdateAppearanceResponse>
{
  constructor(
    private appearanceRepository: AppearanceRepository,
    private episodeRepository: EpisodeRepository,
    private characterRepository: CharacterRepository,
  ) {}

  async execute(
    data: UpdateAppearanceDTO,
  ): Promise<Result<UpdateAppearanceResponse>> {
    const appearance = await this.appearanceRepository.getOne(data.id);

    if (!appearance) {
      return Result.error(appearanceNotFoundError());
    }

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

    appearance.characterId = data.characterId ?? appearance.characterId;
    appearance.episodeId = data.episodeId ?? appearance.episodeId;
    appearance.initMinute = data.initMinute ?? appearance.initMinute;
    appearance.initSecond = data.initSecond ?? appearance.initSecond;
    appearance.finishMinute = data.finishMinute ?? appearance.finishMinute;
    appearance.finishSecond = data.finishSecond ?? appearance.finishSecond;

    if (await this.appearanceRepository.appearanceOverlaps(appearance)) {
      return Result.error(appearanceTimeOverlapsError());
    }

    await this.appearanceRepository.save(appearance);

    return Result.success({
      id: appearance.id,
      characterId: appearance.characterId,
      episodeId: appearance.episodeId,
      initMinute: appearance.initMinute,
      initSecond: appearance.initSecond,
      finishMinute: appearance.finishMinute,
      finishSecond: appearance.finishSecond,
    });
  }
}
