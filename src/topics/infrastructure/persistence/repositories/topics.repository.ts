import { Injectable } from "@nestjs/common";
import { TopicsRepository } from "../topics.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { TopicsEntity } from "../entities/topics.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { Topics } from "../../../domain/topics";
import { TopicsMapper } from "../mappers/topics.mapper";
import { IPaginationOptions } from "../../../../utils/types/pagination-options";
import { FilterTopicsDto, SortTopicsDto } from "../../../dto/query-topics.dto";

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
}