import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { UserRepository } from "./repository/user.repository";
import { ConfigService } from "@nestjs/config";
import { UserEntity } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrpyt from 'bcrypt';
import { AuthProvidersEnum } from "../auth/auth-provider.enum";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    private readonly salt: number = 10;
    constructor(
        private readonly repository: UserRepository,
        private readonly configService: ConfigService,
    ) {
        this.salt = this.configService.getOrThrow<number>("SALT");
    }

    async findOneById(userId: number): Promise<UserEntity> {
        try {
            if (!userId) {
                this.logger.error(`userId was not provided.`);
                throw new UnprocessableEntityException(`userId was not provided`);
            }
            const user = await this.repository.findOneById(userId);
            if (!user) {
                this.logger.error(`USER with userId: ${userId} not found.`);
                throw new NotFoundException(`USER with userId: ${userId} not found.`);
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    async findOnyByEmail(email: string): Promise<UserEntity> {
        try {
            if (!email) {
                this.logger.error(`email was not provided.`);
                throw new UnprocessableEntityException(`email was not provided`);
            }

            const user = await this.repository.findOneByEmail(email);
            if (!user) {
                this.logger.error(`USER with email: ${email} not found.`);
                throw new NotFoundException(`USER with email: ${email} not found.`);
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        try {
            let isExists: UserEntity | null = null;
            let user: UserEntity;
            const { email, password, nickname } = createUserDto;

            if (!email || !password || !nickname) {
                this.logger.error(`Required arguments were not passed.`);
                throw new UnprocessableEntityException(`Required arguments were not passed.`);
            }

            isExists = await this.repository.findOneByEmail(email);
            if (isExists) {
                this.logger.error(`The email address is already in use.`);
                throw new UnprocessableEntityException(`The email address is already in use.`);
            }

            isExists = await this.repository.findOneByNickname(nickname);
            if (isExists) {
                this.logger.error(`The nickname is already in use.`);
                throw new UnprocessableEntityException(`The nickname is already in use`);
            }

            const hashedPassword = await this.hashPassword(password);

            user = new UserEntity({
                email: email,
                password: hashedPassword,
                nickname: nickname,
                provider: AuthProvidersEnum.email,
            });

            user = await this.repository.create(user);
            return user;
        } catch (error) {
            throw error;
        }
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrpyt.hash(password, this.salt);
    }
}