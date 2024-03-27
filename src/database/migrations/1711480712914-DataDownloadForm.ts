import { MigrationInterface, QueryRunner } from "typeorm";

export class DataDownloadForm1711480712914 implements MigrationInterface {
    name = 'DataDownloadForm1711480712914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "study" ADD "dataDownloadFormId" uuid`);
        await queryRunner.query(`ALTER TABLE "study" ADD CONSTRAINT "FK_05f447331ddddc6aafca88b7ab3" FOREIGN KEY ("dataDownloadFormId") REFERENCES "form"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "study" DROP CONSTRAINT "FK_05f447331ddddc6aafca88b7ab3"`);
        await queryRunner.query(`ALTER TABLE "study" DROP COLUMN "dataDownloadFormId"`);
    }

}
