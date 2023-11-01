import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1698842462203 implements MigrationInterface {
    name = 'InitialMigration1698842462203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api_key" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "appName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b1bd840641b8acbaad89c3d8d11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "country_code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "countryName" character varying NOT NULL, "code" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" uuid, "updatedById" uuid, CONSTRAINT "PK_476bd989ae25ae267f1bdf8d9f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."policy_type_enum" AS ENUM('TermsOfService', 'PrivacyPolicy')`);
        await queryRunner.query(`CREATE TABLE "policy" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."policy_type_enum" NOT NULL DEFAULT 'TermsOfService', "title" character varying NOT NULL, "subtitle" character varying NOT NULL, "text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" uuid, "updatedById" uuid, CONSTRAINT "PK_9917b0c5e4286703cc656b1d39f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "study" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "isActive" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "onboardingId" uuid, "formId" uuid, "createdById" uuid, "updatedById" uuid, CONSTRAINT "PK_ae14dbea0172b8521edb2ce4597" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "form" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "fields" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" uuid, "updatedById" uuid, CONSTRAINT "PK_8f72b95aa2f8ba82cf95dc7579e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "onboarding_step" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "subtitle" character varying NOT NULL, "description" character varying NOT NULL, "imageUrl" character varying NOT NULL, "details" character varying NOT NULL, "order" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" uuid, "updatedById" uuid, CONSTRAINT "PK_f0cf055bfbabf8d3ae96885e8a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "onboarding" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "formId" uuid, "createdById" uuid, "updatedById" uuid, CONSTRAINT "PK_b8b6cfe63674aaee17874f033cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "study_country_codes_country_code" ("studyId" uuid NOT NULL, "countryCodeId" uuid NOT NULL, CONSTRAINT "PK_6d457cf6c3caceb6d8b0bb241d3" PRIMARY KEY ("studyId", "countryCodeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4cfb59aaf5b2a9569d7870b4e0" ON "study_country_codes_country_code" ("studyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1bbd7a5ca5487401312dbc3c64" ON "study_country_codes_country_code" ("countryCodeId") `);
        await queryRunner.query(`CREATE TABLE "study_policies_policy" ("studyId" uuid NOT NULL, "policyId" uuid NOT NULL, CONSTRAINT "PK_227ebf691b91ca5d622d4b21f1c" PRIMARY KEY ("studyId", "policyId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_af78054ab5470ed0b9bd86e2b1" ON "study_policies_policy" ("studyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d10bca86457cc7127c730c63a0" ON "study_policies_policy" ("policyId") `);
        await queryRunner.query(`CREATE TABLE "onboarding_steps_onboarding_step" ("onboardingId" uuid NOT NULL, "onboardingStepId" uuid NOT NULL, CONSTRAINT "PK_cbb2d9f76b38f86584808d07290" PRIMARY KEY ("onboardingId", "onboardingStepId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ca7c49c6f5c1c011e542d3a9d8" ON "onboarding_steps_onboarding_step" ("onboardingId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a970c7645870f36dff75a36834" ON "onboarding_steps_onboarding_step" ("onboardingStepId") `);
        await queryRunner.query(`ALTER TABLE "country_code" ADD CONSTRAINT "FK_a3f647921b7ce7ba68dec258bb7" FOREIGN KEY ("createdById") REFERENCES "api_key"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "country_code" ADD CONSTRAINT "FK_9f556814e7dad8792d8301d00f9" FOREIGN KEY ("updatedById") REFERENCES "api_key"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "policy" ADD CONSTRAINT "FK_e2a559dc71c48a5f3514b2e91c3" FOREIGN KEY ("createdById") REFERENCES "api_key"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "policy" ADD CONSTRAINT "FK_9957126451c96dc1b7b24a34adc" FOREIGN KEY ("updatedById") REFERENCES "api_key"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "study" ADD CONSTRAINT "FK_9fd18fb2cef18a5495db7f5b5d3" FOREIGN KEY ("onboardingId") REFERENCES "onboarding"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "study" ADD CONSTRAINT "FK_0d7e9974f29b41c7d6f71e18c35" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "study" ADD CONSTRAINT "FK_01679ee01ea9f9b1d9d9b6ad790" FOREIGN KEY ("createdById") REFERENCES "api_key"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "study" ADD CONSTRAINT "FK_3b87d8181be468dd85b21af815a" FOREIGN KEY ("updatedById") REFERENCES "api_key"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "FK_e09b89bec04563ca2090620c9b8" FOREIGN KEY ("createdById") REFERENCES "api_key"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "FK_2f59b3364cd5979b5bdb0b04a2e" FOREIGN KEY ("updatedById") REFERENCES "api_key"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onboarding_step" ADD CONSTRAINT "FK_021b04c275fa1963d765c36c993" FOREIGN KEY ("createdById") REFERENCES "api_key"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onboarding_step" ADD CONSTRAINT "FK_157bc9b6ea1f87c17ffd38a2e45" FOREIGN KEY ("updatedById") REFERENCES "api_key"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onboarding" ADD CONSTRAINT "FK_8a1e0db1e6a16db27197d6ed3cc" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onboarding" ADD CONSTRAINT "FK_5d829aaeb052ae45fd4386245cd" FOREIGN KEY ("createdById") REFERENCES "api_key"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onboarding" ADD CONSTRAINT "FK_a425a79e547f53852fecb38029f" FOREIGN KEY ("updatedById") REFERENCES "api_key"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "study_country_codes_country_code" ADD CONSTRAINT "FK_4cfb59aaf5b2a9569d7870b4e0b" FOREIGN KEY ("studyId") REFERENCES "study"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "study_country_codes_country_code" ADD CONSTRAINT "FK_1bbd7a5ca5487401312dbc3c64e" FOREIGN KEY ("countryCodeId") REFERENCES "country_code"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "study_policies_policy" ADD CONSTRAINT "FK_af78054ab5470ed0b9bd86e2b1f" FOREIGN KEY ("studyId") REFERENCES "study"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "study_policies_policy" ADD CONSTRAINT "FK_d10bca86457cc7127c730c63a0d" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onboarding_steps_onboarding_step" ADD CONSTRAINT "FK_ca7c49c6f5c1c011e542d3a9d82" FOREIGN KEY ("onboardingId") REFERENCES "onboarding"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onboarding_steps_onboarding_step" ADD CONSTRAINT "FK_a970c7645870f36dff75a36834b" FOREIGN KEY ("onboardingStepId") REFERENCES "onboarding_step"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding_steps_onboarding_step" DROP CONSTRAINT "FK_a970c7645870f36dff75a36834b"`);
        await queryRunner.query(`ALTER TABLE "onboarding_steps_onboarding_step" DROP CONSTRAINT "FK_ca7c49c6f5c1c011e542d3a9d82"`);
        await queryRunner.query(`ALTER TABLE "study_policies_policy" DROP CONSTRAINT "FK_d10bca86457cc7127c730c63a0d"`);
        await queryRunner.query(`ALTER TABLE "study_policies_policy" DROP CONSTRAINT "FK_af78054ab5470ed0b9bd86e2b1f"`);
        await queryRunner.query(`ALTER TABLE "study_country_codes_country_code" DROP CONSTRAINT "FK_1bbd7a5ca5487401312dbc3c64e"`);
        await queryRunner.query(`ALTER TABLE "study_country_codes_country_code" DROP CONSTRAINT "FK_4cfb59aaf5b2a9569d7870b4e0b"`);
        await queryRunner.query(`ALTER TABLE "onboarding" DROP CONSTRAINT "FK_a425a79e547f53852fecb38029f"`);
        await queryRunner.query(`ALTER TABLE "onboarding" DROP CONSTRAINT "FK_5d829aaeb052ae45fd4386245cd"`);
        await queryRunner.query(`ALTER TABLE "onboarding" DROP CONSTRAINT "FK_8a1e0db1e6a16db27197d6ed3cc"`);
        await queryRunner.query(`ALTER TABLE "onboarding_step" DROP CONSTRAINT "FK_157bc9b6ea1f87c17ffd38a2e45"`);
        await queryRunner.query(`ALTER TABLE "onboarding_step" DROP CONSTRAINT "FK_021b04c275fa1963d765c36c993"`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "FK_2f59b3364cd5979b5bdb0b04a2e"`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "FK_e09b89bec04563ca2090620c9b8"`);
        await queryRunner.query(`ALTER TABLE "study" DROP CONSTRAINT "FK_3b87d8181be468dd85b21af815a"`);
        await queryRunner.query(`ALTER TABLE "study" DROP CONSTRAINT "FK_01679ee01ea9f9b1d9d9b6ad790"`);
        await queryRunner.query(`ALTER TABLE "study" DROP CONSTRAINT "FK_0d7e9974f29b41c7d6f71e18c35"`);
        await queryRunner.query(`ALTER TABLE "study" DROP CONSTRAINT "FK_9fd18fb2cef18a5495db7f5b5d3"`);
        await queryRunner.query(`ALTER TABLE "policy" DROP CONSTRAINT "FK_9957126451c96dc1b7b24a34adc"`);
        await queryRunner.query(`ALTER TABLE "policy" DROP CONSTRAINT "FK_e2a559dc71c48a5f3514b2e91c3"`);
        await queryRunner.query(`ALTER TABLE "country_code" DROP CONSTRAINT "FK_9f556814e7dad8792d8301d00f9"`);
        await queryRunner.query(`ALTER TABLE "country_code" DROP CONSTRAINT "FK_a3f647921b7ce7ba68dec258bb7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a970c7645870f36dff75a36834"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ca7c49c6f5c1c011e542d3a9d8"`);
        await queryRunner.query(`DROP TABLE "onboarding_steps_onboarding_step"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d10bca86457cc7127c730c63a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_af78054ab5470ed0b9bd86e2b1"`);
        await queryRunner.query(`DROP TABLE "study_policies_policy"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1bbd7a5ca5487401312dbc3c64"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4cfb59aaf5b2a9569d7870b4e0"`);
        await queryRunner.query(`DROP TABLE "study_country_codes_country_code"`);
        await queryRunner.query(`DROP TABLE "onboarding"`);
        await queryRunner.query(`DROP TABLE "onboarding_step"`);
        await queryRunner.query(`DROP TABLE "form"`);
        await queryRunner.query(`DROP TABLE "study"`);
        await queryRunner.query(`DROP TABLE "policy"`);
        await queryRunner.query(`DROP TYPE "public"."policy_type_enum"`);
        await queryRunner.query(`DROP TABLE "country_code"`);
        await queryRunner.query(`DROP TABLE "api_key"`);
    }

}
