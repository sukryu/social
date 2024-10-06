import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { NullableType } from "src/core/types/nullable.type";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repo: Repository<UserEntity>,
    ) {}

    async findOneById(userId: number): Promise<NullableType<UserEntity>> {
        try {
            const user = await this.repo.findOne({ where: { id: userId }});
            if (!user) return null;
            else return user;
        } catch (error) {
            throw error;
        }
    }

    async findOneByEmail(email: string): Promise<NullableType<UserEntity>> {
        try {
            const user = await this.repo.findOne({ where: { email } });
            if (!user) return null;
            else return user;
        } catch (error) {
            throw error;
        }
    }

    async findOneByNickname(nickname: string): Promise<NullableType<UserEntity>> {
        try {
            const user = await this.repo.findOne({ where: { nickname }});
            if (!user) return null;
            else return user;
        } catch (error) {
            throw error;
        }
    }
    
    async create(data: Partial<UserEntity>): Promise<UserEntity> {
        try {
            await this.repo.create(data);
            return await this.repo.save(data);
        } catch (error) {
            throw error;
        }
    }

    async update(data: Partial<UserEntity>): Promise<UserEntity> {
        try {
            return await this.repo.save(data);
        } catch (error) {
            throw error;
        }
    }

    async delete(userId: number): Promise<void> {
        try {
            await this.repo.softDelete({ id: userId });
        } catch (error) {
            throw error;
        }
    }
}