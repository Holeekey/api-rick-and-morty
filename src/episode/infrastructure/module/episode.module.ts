import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/infrastruture/module/common/common.module';
import { EpisodeRepositoryPostgres } from '../repositories/episode.repository';
import { EpisodeStatusRepositoryPostgres } from '../repositories/status.repository';
import { SeasonRepositoryPostgres } from '../repositories/season.repository';
import { FindManyEpisodesController } from '../controllers/find-many/find-many-episodes.controller';
import { FindOneEpisodeController } from '../controllers/find-one/find-one-episode.controller';
import { CreateEpisodeController } from '../controllers/create/create-episode.controller';
import { DeleteEpisodeController } from '../controllers/delete/delete-episode.controller';
import { UpdateEpisodeController } from '../controllers/update/update-episode.controller';

@Module({
  controllers: [
    FindManyEpisodesController,
    FindOneEpisodeController,
    CreateEpisodeController,
    DeleteEpisodeController,
    UpdateEpisodeController,
  ],
  providers: [
    EpisodeRepositoryPostgres,
    EpisodeStatusRepositoryPostgres,
    SeasonRepositoryPostgres,
  ],
  imports: [CommonModule],
})
export class EpisodeModule {}
