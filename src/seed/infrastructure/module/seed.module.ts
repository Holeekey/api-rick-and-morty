import { Module } from '@nestjs/common';
import { SeedController } from '../controllers/seed.controller';
import { CommonModule } from 'src/common/infrastruture/module/common/common.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [SeedController],
  imports: [CommonModule, HttpModule],
})
export class SeedModule {}
