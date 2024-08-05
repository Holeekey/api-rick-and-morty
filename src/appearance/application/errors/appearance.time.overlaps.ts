import { makeApplicationErrorFactory } from '../../../common/application/error/application.error';

export const APPEARANCE_TIME_OVERLAPS = 'APPEARANCE TIME OVERLAPS' as const;

export const appearanceTimeOverlapsError = makeApplicationErrorFactory({
  name: APPEARANCE_TIME_OVERLAPS,
  message: 'The appearance time overlaps another in the same episode',
});
