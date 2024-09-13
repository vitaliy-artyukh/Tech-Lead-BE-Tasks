import { MigrationInterface, QueryRunner } from 'typeorm'

export class Lock1726219832632 implements MigrationInterface {
    name = 'Lock1726219832632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "surname" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
        )
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_17d1817f241f10a3dbafb169fd" ON "users" ("phone_number") `,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX "public"."IDX_17d1817f241f10a3dbafb169fd"`,
        )
        await queryRunner.query(
            `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
        )
        await queryRunner.query(`DROP TABLE "users"`)
    }
}
