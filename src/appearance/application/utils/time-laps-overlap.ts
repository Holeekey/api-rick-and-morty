import { firstMinuteGreaterThan } from './duration-greater-than';
import { TimeLapse } from './types/time-lapse';

export function firstTimeLapseInsideSecond(
  firstTimeLapse: TimeLapse,
  secondTimeLapse: TimeLapse,
) {
  if (
    firstMinuteGreaterThan(
      firstTimeLapse.finishMinute,
      secondTimeLapse.initMinute,
    ) &&
    firstMinuteGreaterThan(
      secondTimeLapse.initMinute,
      firstTimeLapse.initMinute,
    )
  ) {
    console.log('a');
    return true;
  }

  if (
    firstMinuteGreaterThan(
      secondTimeLapse.finishMinute,
      firstTimeLapse.initMinute,
    ) &&
    firstMinuteGreaterThan(
      firstTimeLapse.finishMinute,
      secondTimeLapse.finishMinute,
    )
  ) {
    return true;
  }

  if (
    firstMinuteGreaterThan(
      firstTimeLapse.initMinute,
      secondTimeLapse.initMinute,
    ) &&
    firstMinuteGreaterThan(
      secondTimeLapse.finishMinute,
      firstTimeLapse.finishMinute,
    )
  ) {
    return true;
  }

  return false;
}
