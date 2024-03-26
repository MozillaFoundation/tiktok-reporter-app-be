import { MigrationInterface, QueryRunner } from "typeorm";

export class OnboardingPlatform1710453673624 implements MigrationInterface {
    name = 'OnboardingPlatform1710453673624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding_step" ADD "platform" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding_step" DROP COLUMN "platform"`);
    }

}
