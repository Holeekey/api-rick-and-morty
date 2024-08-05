export type FindManyAppearancesResponse = {
  info: {
    count: number;
    pages: number;
    next: string;
    prev: string;
  };
  results: {
    id: string;
    episodeUrl: string;
    characterUrl: string;
    initMinute: string;
    finishMinute: string;
  }[];
};
