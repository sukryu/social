import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicsEntity } from '../entities/topics.entity';
import { TopicsRepository } from '../topics.repository';
import { TopicsRelationalRepository } from './topics.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TopicsEntity])],
  providers: [
    {
      provide: TopicsRepository,
      useClass: TopicsRelationalRepository,
    },
  ],
  exports: [TopicsRepository],
})
export class RelationalTopicsPersistenceModule {}
