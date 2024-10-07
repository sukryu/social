import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { UserRepository } from "./repository/user.repository";
import { ConfigService } from "@nestjs/config";
import { UserEntity } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrpyt from 'bcrypt';
import { AuthProvidersEnum } from "../auth/auth-provider.enum";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DeepPartial } from "src/core/types/deep-partial.type";

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

    public async findOneById(userId: number): Promise<UserEntity> {
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

    public async findOnyByEmail(email: string): Promise<UserEntity> {
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

    public async findOnyByNickname(nickname: string): Promise<UserEntity> {
        try {
            if (!nickname) {
                this.logger.error(`nickname was not provided.`);
                throw new UnprocessableEntityException(`email was not provided`);
            }

            const user = await this.repository.findOneByNickname(nickname);
            if (!user) {
                this.logger.error(`USER with nickname: ${nickname} not found.`);
                throw new NotFoundException(`USER with nickname: ${nickname} not found.`);
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    public async create(data: Partial<UserEntity> = {}): Promise<UserEntity> {
        try {
            let isExists: UserEntity | null = null;
            let user: UserEntity;
            const { email, password, nickname } = data;

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

    public async update(userId: number, data?: DeepPartial<UserEntity>): Promise<UserEntity> {
        try {
            let isExists: UserEntity | null;
            if (!data || !userId) {
                this.logger.error(`Target data is not provided.`);
                throw new UnprocessableEntityException(`Target data is not provided.`);
            }

            const user = await this.findOneById(userId);
            if (!user) {
                this.logger.error(`User not found.`);
                throw new NotFoundException(`User not found.`);
            }

            if (data.email) {
                isExists = await this.repository.findOneByEmail(data.email);
                if (isExists) {
                    this.logger.error(`This email has already been used.`);
                    throw new UnprocessableEntityException(`This email has already been used.`);
                } else user.email = data.email;
            }

            if (data.nickname) {
                isExists = await this.findOnyByNickname(data.nickname);
                if (isExists) {
                    this.logger.error(`This nickname has already been used.`);
                    throw new UnprocessableEntityException(`This nickname has already been used.`);
                } else user.nickname = data.nickname;
            }

            if (data.password) {
                const hashedPassword = await this.hashPassword(data.password);
                user.password = hashedPassword;
            }

            return await this.repository.update(user);
        } catch (error) {
            throw error;
        }
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrpyt.hash(password, this.salt);
    }
}