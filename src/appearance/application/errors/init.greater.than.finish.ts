import { makeApplicationErrorFactory } from '../../../common/application/error/application.error';

export const INIT_GREATER_THAN_FINISH = 'INIT GREATER THAN FINISH' as const;

export const initGreaterThanFinishjError = makeApplicationErrorFactory({
  name: INIT_GREATER_THAN_FINISH,
  message: 'The initial appearance minute is greater than the finish one',
});
