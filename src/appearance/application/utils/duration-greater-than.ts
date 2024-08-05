import { Minute } from './types/minute';

export function firstMinuteGreaterThan(
  firstMinute: Minute,
  lastMinute: Minute,
) {
  if (firstMinute.minute > lastMinute.minute) {
    return true;
  }

  console.log(firstMinute);
  console.log(lastMinute);

  if (
    firstMinute.minute === lastMinute.minute &&
    firstMinute.second >= lastMinute.second
  ) {
    console.log('a');
    return true;
  }

  return false;
}
