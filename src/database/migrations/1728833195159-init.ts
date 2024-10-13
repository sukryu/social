import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1728833195159 implements MigrationInterface {
    name = 'Init1728833195159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "topics" ("id" SERIAL NOT NULL, "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e4aa99a3fa60ec3a37d1fc4e853" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "topics"`);
    }

}
