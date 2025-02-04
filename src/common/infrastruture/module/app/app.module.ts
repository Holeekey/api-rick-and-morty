import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeedModule } from 'src/seed/infrastructure/module/seed.module';
import { CommonModule } from '../common/common.module';
import { CharacterModule } from 'src/character/infrastructure/module/character.module';
import { EpisodeModule } from 'src/episode/infrastructure/module/episode.module';
import { AppearanceModule } from 'src/appearance/infrastructure/module/appearance.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule,
    SeedModule,
    CharacterModule,
    EpisodeModule,
    AppearanceModule,
  ],
})
export class AppModule {}
