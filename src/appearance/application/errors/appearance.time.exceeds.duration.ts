import { makeApplicationErrorFactory } from '../../../common/application/error/application.error';

export const APPEARANCE_TIME_EXCEEDS_DURATION =
  'APPEARANCE TIME EXCEEDS DURATION' as const;

export const appearanceTimeExceedsDurationError = makeApplicationErrorFactory({
  name: APPEARANCE_TIME_EXCEEDS_DURATION,
  message: 'The appearance time exceeds the episode duration',
});
