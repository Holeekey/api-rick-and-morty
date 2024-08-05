export function durationToString(minutes: number, seconds: number) {
  const minutesString = minutes / 10 > 1 ? minutes : '0' + minutes;
  const secondsString = seconds / 10 > 1 ? seconds : '0' + seconds;

  return minutesString + ':' + secondsString;
}
