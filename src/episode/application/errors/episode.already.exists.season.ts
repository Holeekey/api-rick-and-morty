import { makeApplicationErrorFactory } from '../../../common/application/error/application.error';

export const EPISODE_ALREADY_EXISTS_SEASON =
  'EPISODE ALREADY EXISTS SEASON' as const;

export const episodeAlreadyExistsSeasonError = makeApplicationErrorFactory({
  name: EPISODE_ALREADY_EXISTS_SEASON,
  message: 'There is already an episode with that name in that season',
});
