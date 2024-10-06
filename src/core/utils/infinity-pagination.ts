import { InfinityPaginationResponseDto } from '../dto/infinity-pagination-response.dto';
import { IPaginationOptions } from '../types/pagination-options';

export const InfinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
): InfinityPaginationResponseDto<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  };
};
