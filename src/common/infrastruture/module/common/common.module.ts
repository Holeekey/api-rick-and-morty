import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/database.connection.service';
import { ConcreteUUIDGenerator } from '../../uuid/concrete.uuid.generator';
import { ConcreteDateProvider } from '../../date/date.provider';
import { WelcomeController } from '../../controller/welcome/welcome.controller';

@Module({
  controllers: [WelcomeController],
  providers: [PrismaService, ConcreteUUIDGenerator, ConcreteDateProvider],
  exports: [PrismaService, ConcreteUUIDGenerator, ConcreteDateProvider],
})
export class CommonModule {}
