export interface CharacterRepository {
  existsById(id: string): Promise<boolean>;
}
