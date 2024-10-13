import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { TopicsService } from './topics.service';
import { Topics } from './domain/topics';
import { CreateTopicsDto } from './dto/create-topics.dto';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { QueryTopicsDto } from './dto/query-topics.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateTopicsDto } from './dto/update-topics.dto';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Topics')
@Controller({
  path: 'topics',
  version: '1',
})
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @ApiCreatedResponse({
    type: Topics,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() req,
    @Body() createTopicsDto: CreateTopicsDto,
  ): Promise<Topics> {
    createTopicsDto.start_time = new Date(createTopicsDto.start_time);
    createTopicsDto.end_time = new Date(createTopicsDto.end_time);
    return this.topicsService.create(req.user.id, createTopicsDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Topics),
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryTopicsDto,
  ): Promise<InfinityPaginationResponseDto<Topics>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.topicsService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @ApiOkResponse({
    type: Topics,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Topics['id']): Promise<NullableType<Topics>> {
    return this.topicsService.findById(id);
  }

  @ApiOkResponse({
    type: Topics,
  })
  @Get(':title')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'title',
    type: String,
    required: true,
  })
  findOneTitle(
    @Param('title') title: Topics['title'],
  ): Promise<NullableType<Topics>> {
    return this.topicsService.findByTitle(title);
  }

  @ApiOkResponse({
    type: Topics,
  })
  @Get(':createdBy')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'createdBy',
    type: String,
    required: true,
  })
  async findCreatedBy(
    @Param('createdBy') createdBy: Topics['createdBy'],
  ): Promise<NullableType<Topics[]>> {
    return await this.topicsService.findByCreatedBy(createdBy);
  }

  @ApiOkResponse({
    type: Topics,
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: Topics['id'],
    @Body() updateTopicsDto: UpdateTopicsDto,
  ): Promise<Topics | null> {
    if (updateTopicsDto.start_time) {
        updateTopicsDto.start_time = new Date(updateTopicsDto.start_time);
    }

    if (updateTopicsDto.end_time) {
        updateTopicsDto.end_time = new Date(updateTopicsDto.end_time);
    }
    return this.topicsService.update(id, updateTopicsDto);
  }
}
