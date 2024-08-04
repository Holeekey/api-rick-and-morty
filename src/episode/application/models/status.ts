import { EpisodeStatus as EpisodeStatusEnum } from './episode';

export type EpisodeStatus = {
  id: string;
  name: EpisodeStatusEnum;
};
