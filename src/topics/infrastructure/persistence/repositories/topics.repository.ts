import { Injectable } from '@nestjs/common';
import { TopicsRepository } from '../topics.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicsEntity } from '../entities/topics.entity';
import {
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Topics } from '../../../domain/topics';
import { TopicsMapper } from '../mappers/topics.mapper';
import { IPaginationOptions } from '../../../../utils/types/pagination-options';
import { FilterTopicsDto, SortTopicsDto } from '../../../dto/query-topics.dto';
import { NullableType } from '../../../../utils/types/nullable.type';

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
    // 초기 where 객체 설정
    const where: FindOptionsWhere<TopicsEntity> = {};

    // filterOptions를 기반으로 조건 추가
    if (filterOptions) {
      if (filterOptions.title) {
        where.title = Like(`%${filterOptions.title}%`); // 제목에 포함된 값으로 검색
      }

      if (filterOptions.description) {
        where.description = Like(`%${filterOptions.description}%`); // 설명에 포함된 값으로 검색
      }

      if (filterOptions.start_time) {
        where.start_time = MoreThanOrEqual(filterOptions.start_time); // start_time이 주어진 값 이후인 항목
      }

      if (filterOptions.end_time) {
        where.end_time = LessThanOrEqual(filterOptions.end_time); // end_time이 주어진 값 이전인 항목
      }

      if (filterOptions.createdBy) {
        where.createdBy = filterOptions.createdBy; // createdBy와 일치하는 항목
      }

      if (filterOptions.updatedBy) {
        where.updatedBy = filterOptions.updatedBy; // updatedBy와 일치하는 항목
      }
    }

    // 엔티티를 검색하여 정렬 및 페이징 적용
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

    // 결과를 매핑하여 반환
    return entities.map((topic) => TopicsMapper.toDomain(topic));
  }

  async findById(id: Topics['id']): Promise<NullableType<Topics>> {
    const entity = await this.topicsRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? TopicsMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Topics['id'][]): Promise<Topics[]> {
    const entities = await this.topicsRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((topic) => TopicsMapper.toDomain(topic));
  }

  async findByTitle(title: Topics['title']): Promise<NullableType<Topics>> {
    if (!title) return null;

    const entity = await this.topicsRepository.findOne({
      where: { title: String(title) },
    });

    return entity ? TopicsMapper.toDomain(entity) : null;
  }

  async findByCreatedBy(
    createdBy: Topics['createdBy'],
  ): Promise<NullableType<Topics[]>> {
    if (!createdBy) return null;

    const entities = await this.topicsRepository.find({
      where: { createdBy: Number(createdBy) },
    });

    return entities.map((topic) => TopicsMapper.toDomain(topic));
  }

  async update(id: Topics['id'], payload: Partial<Topics>): Promise<Topics> {
    const entity = await this.topicsRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Topics not found.');
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
