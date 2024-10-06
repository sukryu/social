import { ApiResponseProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { EntityHelper } from "src/core/utils/entity-helper";
import { AuthProvidersEnum } from "src/modules/auth/auth-provider.enum";
import { AfterLoad, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'users'
})
export class UserEntity extends EntityHelper {
    @ApiResponseProperty({ type: Number })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiResponseProperty({ type: String, example: 'test@test.com' })
    @Column({ type: String, nullable: false, unique: true })
    @Expose({ groups: ['me', 'admin'] })
    @Index()
    email: string;

    @Column({ nullable: true })
    @Exclude({ toPlainOnly: true })
    password?: string;

    @Exclude({ toPlainOnly: true })
    public previousPassword?: string;

    @AfterLoad()
    public loadPreviousPassword(): void {
        this.previousPassword = this.password;
    }

    @ApiResponseProperty({ type: String, example: 'email' })
    @Column({ default: AuthProvidersEnum.email })
    @Expose({ groups: ['me', 'admin'] })
    provider: string;

    @ApiResponseProperty({ type: String, example: '1234567890' })
    @Index()
    @Column({ type: String, nullable: true })
    @Expose({ groups: ['me', 'admin'] })
    socialId?: string | null;

    @ApiResponseProperty({ type: String })
    @Column({ type: String, nullable: false, unique: true })
    nickname: string;

    @ApiResponseProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiResponseProperty()
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiResponseProperty()
    @DeleteDateColumn()
    deletedAt: Date | null;
}