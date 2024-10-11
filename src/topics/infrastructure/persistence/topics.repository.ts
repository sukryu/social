import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { Topics } from "../../domain/topics";
import { FilterTopicsDto, SortTopicsDto } from "../../dto/query-topics.dto";

export abstract class TopicsRepository {
    abstract create(
        data: Omit<Topics, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<Topics>;

    abstract findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterTopicsDto | null;
        sortOptions?: SortTopicsDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<Topics[]>;

    abstract findById(id: Topics['id']): Promise<NullableType<Topics>>;
    abstract findByIds(ids: Topics['id'][]): Promise<Topics[]>;
    abstract findByTitle(title: Topics['title']): Promise<NullableType<Topics>>;
    abstract findByCreatedBy(createdBy: Topics['createdBy']): Promise<NullableType<Topics>>;
    
    abstract update(
        id: Topics['id'],
        payload: DeepPartial<Topics>
    ): Promise<NullableType<Topics>>;
}