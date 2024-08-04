export enum EpisodeStatus {
  ACTIVE = 'Active',
  CANCELLED = 'Cancelled',
}

export type Episode = {
  id: string;
  name: string;
  code: string;
  seasonId: string;
  aireDate: Date;
  statusId: string;
  minutesDuration: number;
  secondsDuration: number;
};
