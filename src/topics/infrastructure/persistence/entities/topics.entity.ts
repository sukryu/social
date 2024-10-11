import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EntityRelationalHelper } from "../../../../utils/relational-entity-helper";

@Entity({
    name: 'topics'
})
export class TopicsEntity extends EntityRelationalHelper {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: Number, nullable: false })
    createdBy: number;

    @Column({ type: Number, nullable: false })
    updatedBy: number;

    @Column({ type: String, nullable: false })
    title: string;

    @Column({ type: String, nullable: false })
    description: string;

    @Column({ type: Date, nullable: false })
    start_time: Date;

    @Column({ type: Date, nullable: false })
    end_time: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}