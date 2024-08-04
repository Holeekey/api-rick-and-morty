import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/database.connection.service';
import { ConcreteUUIDGenerator } from '../../uuid/concrete.uuid.generator';
import { ConcreteDateProvider } from '../../date/date.provider';

@Module({
  providers: [PrismaService, ConcreteUUIDGenerator, ConcreteDateProvider],
  exports: [PrismaService, ConcreteUUIDGenerator, ConcreteDateProvider],
})
export class CommonModule {}
