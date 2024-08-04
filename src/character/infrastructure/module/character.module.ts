import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/infrastruture/module/common/common.module';
import { FindManyCharactersController } from '../controllers/find-many/find-many-characters.controller';
import { CharacterRepositoryPostgres } from '../repositories/postgres/chatacter.repository';
import { SpeciesRepositoryPostgres } from '../repositories/postgres/species.repository';
import { CharacterStatusRepositoryPostgres } from '../repositories/postgres/status.repository';
import { FindOneCharacterController } from '../controllers/find-one/find-one-character.controller';
import { CreateCharacterController } from '../controllers/create/create-character.controller';
import { DeleteCharacterController } from '../controllers/delete/delete-character.controller';
import { UpdateCharacterController } from '../controllers/update/update-character.controller';

@Module({
  controllers: [
    FindManyCharactersController,
    FindOneCharacterController,
    CreateCharacterController,
    DeleteCharacterController,
    UpdateCharacterController,
  ],
  providers: [
    CharacterRepositoryPostgres,
    SpeciesRepositoryPostgres,
    CharacterStatusRepositoryPostgres,
  ],
  imports: [CommonModule],
})
export class CharacterModule {}
