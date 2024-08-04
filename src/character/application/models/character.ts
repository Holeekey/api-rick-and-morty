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
  status: CharacterStatus;
  species: string;
  gender: Gender;
  createdAt: Date;
}
