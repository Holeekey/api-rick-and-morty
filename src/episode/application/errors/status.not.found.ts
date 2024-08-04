import { makeApplicationErrorFactory } from '../../../common/application/error/application.error';

export const STATUS_NOT_FOUND = 'STATUS NOT FOUND' as const;

export const statusNotFoundError = makeApplicationErrorFactory({
  name: STATUS_NOT_FOUND,
  message: 'The episode status does not exists',
});
