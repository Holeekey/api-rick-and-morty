import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/infrastruture/module/common/common.module';
import { CharacterRepositoryByAppearancePostgres } from '../repositories/postgres/character.repository';
import { EpisodeRepositoryByAppearancePostgres } from '../repositories/postgres/episode.repository';
import { AppearanceRepositoryPostgres } from '../repositories/postgres/appearance.repository';
import { CreateAppearanceController } from '../controllers/create/create-appearance.controller';

@Module({
  controllers: [CreateAppearanceController],
  providers: [
    CharacterRepositoryByAppearancePostgres,
    EpisodeRepositoryByAppearancePostgres,
    AppearanceRepositoryPostgres,
  ],
  imports: [CommonModule],
})
export class AppearanceModule {}
