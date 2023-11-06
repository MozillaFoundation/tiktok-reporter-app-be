import { MigrationInterface, QueryRunner } from "typeorm";

export class RemvoeOnUpdateNoAction1699269468444 implements MigrationInterface {
    name = 'RemvoeOnUpdateNoAction1699269468444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "study_country_codes_country_code" DROP CONSTRAINT "FK_4cfb59aaf5b2a9569d7870b4e0b"`);
        await queryRunner.query(`ALTER TABLE "study_policies_policy" DROP CONSTRAINT "FK_af78054ab5470ed0b9bd86e2b1f"`);
        await queryRunner.query(`ALTER TABLE "onboarding_steps_onboarding_step" DROP CONSTRAINT "FK_ca7c49c6f5c1c011e542d3a9d82"`);
        await queryRunner.query(`ALTER TABLE "study_country_codes_country_code" ADD CONSTRAINT "FK_4cfb59aaf5b2a9569d7870b4e0b" FOREIGN KEY ("studyId") REFERENCES "study"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "study_policies_policy" ADD CONSTRAINT "FK_af78054ab5470ed0b9bd86e2b1f" FOREIGN KEY ("studyId") REFERENCES "study"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "onboarding_steps_onboarding_step" ADD CONSTRAINT "FK_ca7c49c6f5c1c011e542d3a9d82" FOREIGN KEY ("onboardingId") REFERENCES "onboarding"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding_steps_onboarding_step" DROP CONSTRAINT "FK_ca7c49c6f5c1c011e542d3a9d82"`);
        await queryRunner.query(`ALTER TABLE "study_policies_policy" DROP CONSTRAINT "FK_af78054ab5470ed0b9bd86e2b1f"`);
        await queryRunner.query(`ALTER TABLE "study_country_codes_country_code" DROP CONSTRAINT "FK_4cfb59aaf5b2a9569d7870b4e0b"`);
        await queryRunner.query(`ALTER TABLE "onboarding_steps_onboarding_step" ADD CONSTRAINT "FK_ca7c49c6f5c1c011e542d3a9d82" FOREIGN KEY ("onboardingId") REFERENCES "onboarding"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "study_policies_policy" ADD CONSTRAINT "FK_af78054ab5470ed0b9bd86e2b1f" FOREIGN KEY ("studyId") REFERENCES "study"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "study_country_codes_country_code" ADD CONSTRAINT "FK_4cfb59aaf5b2a9569d7870b4e0b" FOREIGN KEY ("studyId") REFERENCES "study"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
