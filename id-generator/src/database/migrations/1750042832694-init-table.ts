import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTable1750042832694 implements MigrationInterface {
  name = 'InitTable1750042832694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "counters" ("id" date NOT NULL, "sequence" integer NOT NULL, CONSTRAINT "PK_910bfcbadea9cde6397e0daf996" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "counters"`);
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
