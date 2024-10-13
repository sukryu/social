import { Module } from '@nestjs/common';
import { RelationalTopicsPersistenceModule } from './infrastructure/persistence/repositories/relational-persistence.module';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

@Module({
  imports: [RelationalTopicsPersistenceModule],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [RelationalTopicsPersistenceModule, TopicsService],
})
export class TopicsModule {}
