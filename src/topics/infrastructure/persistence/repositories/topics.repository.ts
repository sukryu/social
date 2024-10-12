import { Injectable } from "@nestjs/common";
import { TopicsRepository } from "../topics.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { TopicsEntity } from "../entities/topics.entity";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { Topics } from "../../../domain/topics";
import { TopicsMapper } from "../mappers/topics.mapper";
import { IPaginationOptions } from "../../../../utils/types/pagination-options";
import { FilterTopicsDto, SortTopicsDto } from "../../../dto/query-topics.dto";
import { NullableType } from "../../../../utils/types/nullable.type";
import { DeepPartial } from "../../../../utils/types/deep-partial.type";

@Injectable()
export class TopicsRelationalRepository implements TopicsRepository {
    constructor(
        @InjectRepository(TopicsEntity)
        private readonly topicsRepository: Repository<TopicsEntity>,
    ) {}

    async create(data: Topics): Promise<Topics> {
        const persistenceModel = TopicsMapper.toPersistence(data);
        const newEntity = await this.topicsRepository.save(
            this.topicsRepository.create(persistenceModel),
        );
        return TopicsMapper.toDomain(newEntity);
    }

    async findManyWithPagination({ 
        filterOptions, 
        sortOptions, 
        paginationOptions, 
    }: { 
        filterOptions?: FilterTopicsDto | null; 
        sortOptions?: SortTopicsDto[] | null; 
        paginationOptions: IPaginationOptions; 
    }): Promise<Topics[]> {
        const where: FindOptionsWhere<TopicsEntity> = {};

        const entities = await this.topicsRepository.find({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: where,
            order: sortOptions?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort.orderBy]: sort.order,
                }),
                {},
            ),
        });

        return entities.map((topic) => TopicsMapper.toDomain(topic));
    }

    async findById(id: Topics["id"]): Promise<NullableType<Topics>> {
        const entity = await this.topicsRepository.findOne({
            where: { id: Number(id) },
        });

        return entity ? TopicsMapper.toDomain(entity) : null;
    }

    async findByIds(ids: Topics["id"][]): Promise<Topics[]> {
        const entities = await this.topicsRepository.find({
            where: { id: In(ids) },
        });

        return entities.map((topic) => TopicsMapper.toDomain(topic));
    }

    async findByTitle(title: Topics["title"]): Promise<NullableType<Topics>> {
        if (!title) return null;

        const entity = await this.topicsRepository.findOne({
            where: { title: String(title) },
        });

        return entity ? TopicsMapper.toDomain(entity) : null;
    }

    async findByCreatedBy(createdBy: Topics["createdBy"]): Promise<NullableType<Topics[]>> {
        if (!createdBy) return null;

        const entities = await this.topicsRepository.find({
            where: { createdBy: Number(createdBy) },
        });

        return entities.map((topic) => TopicsMapper.toDomain(topic));
    }

    async update(id: Topics["id"], payload: Partial<Topics>): Promise<Topics> {
        const entity = await this.topicsRepository.findOne({
            where: { id: Number(id) },
        });

        if (!entity) {
            throw new Error("Topics not found.");
        }

        const updatedEntity = await this.topicsRepository.save(
            this.topicsRepository.create(
                TopicsMapper.toPersistence({
                    ...TopicsMapper.toDomain(entity),
                    ...payload,
                }),
            ),
        );

        return TopicsMapper.toDomain(updatedEntity);
    }
}