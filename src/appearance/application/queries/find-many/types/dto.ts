export type FindManyAppearancesDTO = {
  page: number;
  perPage: number;
  episodeId?: string;
  seasonId?: string;
  characterId?: string;
  characterStatusId?: string;
  episodeStatusId?: string;
};
