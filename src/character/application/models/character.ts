export enum CharacterStatus {
  ACTIVE = 'Active',
  SUSPENDED = 'Suspended',
}
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  GENDERLESS = 'Genderless',
  UNKNOWN = 'Unknown',
}

export interface Character {
  id: string;
  name: string;
  statusId: string;
  speciesId: string;
  gender: Gender;
  createdAt: Date;
  appearancesId: string[];
}
