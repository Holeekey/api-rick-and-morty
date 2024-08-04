import { makeApplicationErrorFactory } from '../../../common/application/error/application.error';

export const EPISODE_DURATION_EXCEEDED = 'EPISODE DURATION EXCEEDED' as const;

export const episodeDurationExceededError = makeApplicationErrorFactory({
  name: EPISODE_DURATION_EXCEEDED,
  message: 'The episode duration exceeded, 60:00 minutes maximum',
});
