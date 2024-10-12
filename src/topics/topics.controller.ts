import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "../roles/roles.decorator";
import { RoleEnum } from "../roles/roles.enum";
import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../roles/roles.guard";
import { TopicsService } from "./topics.service";

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Topics')
@Controller({
    path: 'topics',
    version: '1'
})
export class TopicsController {
    constructor(
        private readonly topicsService: TopicsService,
    ) {}

    
}