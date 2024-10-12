import { BadRequestException, ForbiddenException, HttpStatus, Injectable, Logger, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { TopicsRepository } from "./infrastructure/persistence/topics.repository";
import { CreateTopicsDto } from "./dto/create-topics.dto";
import { Topics } from "./domain/topics";
import { UsersService } from "../users/users.service";
import { RoleEnum } from "../roles/roles.enum";
import { FilterTopicsDto, SortTopicsDto } from "./dto/query-topics.dto";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { NullableType } from "../utils/types/nullable.type";
import { UpdateTopicsDto } from "./dto/update-topics.dto";

@Injectable()
export class TopicsService {
    private readonly logger = new Logger(TopicsService.name);
    constructor(
        private readonly topicsRepository: TopicsRepository,
        private readonly usersService: UsersService,
    ) {}

    async create(userId: number, createTopicsDto: CreateTopicsDto): Promise<Topics> {
        if (!userId) {
            this.logger.error(`USER ID was not provided.`);
            throw new BadRequestException(`REQUIRED PARAMETER WAS NOT PROVIDED.`);
        }

        const user = await this.usersService.findById(userId);
        if (!user) {
            this.logger.error(`User not found.`);
            throw new NotFoundException(`User not found.`);
        } else {
            if (user.role?.id) {
                const roleObject = Object.values(RoleEnum)
                    .map(String)
                    .includes(String(user.role.id));

                if (!roleObject) {
                    throw new UnprocessableEntityException({
                        status: HttpStatus.UNPROCESSABLE_ENTITY,
                        error: {
                            role: 'roleNotExists',
                        },
                    });
                }

                if (user.role.id !== RoleEnum.admin) {
                    this.logger.error(`Permission denied.`);
                    throw new ForbiddenException(`Permission denied.`);
                }
            }
        }

        if (createTopicsDto.title) {
            const topicObject = await this.topicsRepository.findByTitle(
                createTopicsDto.title
            );
            if (topicObject) {
                throw new UnprocessableEntityException({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    error: {
                        title: 'titleAlreadyExists',
                    },
                });
            }
        }

        const now = new Date();
        if (createTopicsDto.start_time < now) {
            this.logger.error(`Start time cannot be in the past.`);
            throw new BadRequestException(`Start time cannot be in the past.`);
        }

        if (createTopicsDto.end_time <= createTopicsDto.start_time) {
            this.logger.error(`End time must be after start time.`);
            throw new BadRequestException(`End time must be after start time.`);
        }

        return this.topicsRepository.create({
            createdBy: userId,
            updatedBy: userId,
            title: createTopicsDto.title,
            description: createTopicsDto.description,
            start_time: createTopicsDto.start_time,
            end_time: createTopicsDto.end_time,
        });
    }

    findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterTopicsDto | null;
        sortOptions?: SortTopicsDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<Topics[]> {
        return this.topicsRepository.findManyWithPagination({
            filterOptions,
            sortOptions,
            paginationOptions,
        });
    }

    findById(id: Topics['id']): Promise<NullableType<Topics>> {
        return this.topicsRepository.findById(id);
    }

    findByIds(ids: Topics['id'][]): Promise<Topics[]> {
        return this.topicsRepository.findByIds(ids);
    }

    findByTitle(title: Topics['title']): Promise<NullableType<Topics>> {
        return this.topicsRepository.findByTitle(title);
    }

    findByCreatedBy(createdBy: Topics['createdBy']): Promise<NullableType<Topics[]>> {
        return this.topicsRepository.findByCreatedBy(createdBy);
    }

    async update(userId: number, updateTopicsDto: UpdateTopicsDto): Promise<Topics> {
        if (!userId || !updateTopicsDto.topicsId) {
            this.logger.error(`Required Parameters was not provided.`);
            throw new BadRequestException(`Required Parameters was not provided.`);
        }

        const topic = await this.topicsRepository.findById(updateTopicsDto.topicsId);
        if (!topic) {
            this.logger.error(`Topic not found.`);
            throw new NotFoundException(`Topic not found.`);
        } else {
            if (updateTopicsDto.title) {
                const title = await this.topicsRepository.findByTitle(updateTopicsDto.title)
                if (title) {
                    this.logger.error(`topic has already been created.`);
                    throw new BadRequestException(`topic has already been created.`);
                }
            }

            const now = new Date();
            if (updateTopicsDto.start_time < now) {
                this.logger.error(`Start time cannot be in the past.`);
                throw new BadRequestException(`Start time cannot be in the past.`);
            }

            if (updateTopicsDto.end_time <= updateTopicsDto.start_time) {
                this.logger.error(`End time must be after start time.`);
                throw new BadRequestException(`End time must be after start time.`);
            }
        }

        const user = await this.usersService.findById(userId);
        if (!user) {
            this.logger.error(`User not found.`);
            throw new NotFoundException(`User not found.`);
        } else {
            if (user.role?.id) {
                const roleObject = Object.values(RoleEnum)
                    .map(String)
                    .includes(String(user.role.id));

                if (!roleObject) {
                    throw new UnprocessableEntityException({
                        status: HttpStatus.UNPROCESSABLE_ENTITY,
                        error: {
                            role: 'roleNotExists',
                        },
                    });
                }

                if (user.role.id !== RoleEnum.admin) {
                    this.logger.error(`Permission denied.`);
                    throw new ForbiddenException(`Permission denied.`);
                }
            }
        }

        return this.topicsRepository.update(updateTopicsDto.topicsId, {
            updatedBy: userId,
            title: updateTopicsDto.title,
            description: updateTopicsDto.description,
            start_time: updateTopicsDto.start_time,
            end_time: updateTopicsDto.end_time,
        });
    }
}