import { Minute } from './types/minute';

export function firstMinuteGreaterThan(
  firstMinute: Minute,
  lastMinute: Minute,
) {
  if (firstMinute.minute > lastMinute.minute) {
    return true;
  }

  if (
    firstMinute.minute === lastMinute.minute &&
    firstMinute.second >= lastMinute.second
  ) {
    return true;
  }

  return false;
}
