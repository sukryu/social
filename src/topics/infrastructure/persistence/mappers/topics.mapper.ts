import { Topics } from "../../../domain/topics";
import { TopicsEntity } from "../entities/topics.entity";

export class TopicsMapper {
    static toDomain(raw: TopicsEntity): Topics {
        const domainEntity = new Topics();
        domainEntity.id = raw.id;
        domainEntity.createdBy = raw.createdBy;
        domainEntity.updatedBy = raw.updatedBy;
        domainEntity.title = raw.title;
        domainEntity.description = raw.description;
        domainEntity.start_time = raw.start_time;
        domainEntity.end_time = raw.end_time;
        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;

        return domainEntity;
    }

    static toPersistence(domainEntity: Topics): TopicsEntity {
        const persistenceEntity = new TopicsEntity();
        if (domainEntity.id && typeof persistenceEntity.id === 'number') {
            persistenceEntity.id = domainEntity.id;
        }
        persistenceEntity.createdBy = domainEntity.createdBy;
        persistenceEntity.updatedBy = domainEntity.updatedBy;
        persistenceEntity.title = domainEntity.title;
        persistenceEntity.description = domainEntity.description;
        persistenceEntity.start_time = domainEntity.start_time;
        persistenceEntity.end_time = domainEntity.end_time;
        persistenceEntity.createdAt = domainEntity.createdAt;
        persistenceEntity.updatedAt = domainEntity.updatedAt;

        return persistenceEntity;
    }
}