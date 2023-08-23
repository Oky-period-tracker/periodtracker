import { MigrationInterface, QueryRunner } from 'typeorm'

export class AllTables1606749253000 implements MigrationInterface {
  down(queryRunner: QueryRunner): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE SEQUENCE about_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;`,
    )

    await queryRunner.query(`
    CREATE TABLE "oky_en"."about" (
        "id" integer DEFAULT nextval('about_id_seq') NOT NULL,
        "json_dump" character varying NOT NULL,
        "timestamp" timestamp NOT NULL,
        "lang" character varying NOT NULL,
        CONSTRAINT "about_pkey" PRIMARY KEY ("id")
    ) WITH (oids = false);`)

    await queryRunner.query(`
        CREATE SEQUENCE about_banner_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."about_banner" (
            "id" integer DEFAULT nextval('about_banner_id_seq') NOT NULL,
            "image" character varying NOT NULL,
            "timestamp" timestamp NOT NULL,
            "lang" character varying NOT NULL,
            CONSTRAINT "about_banner_pkey" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE SEQUENCE analytics_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."analytics" (
            "id" integer DEFAULT nextval('analytics_id_seq') NOT NULL,
            "type" character varying NOT NULL,
            "payload" json NOT NULL,
            "metadata" json NOT NULL,
            "date_created" timestamp DEFAULT now() NOT NULL,
            CONSTRAINT "PK_cc3f23b88a99dbd75748995bc44" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE SEQUENCE app_event_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."app_event" (
            "id" integer DEFAULT nextval('app_event_id_seq') NOT NULL,
            "local_id" uuid NOT NULL,
            "type" character varying NOT NULL,
            "payload" json NOT NULL,
            "metadata" json NOT NULL,
            "user_id" character varying,
            "created_at" timestamp DEFAULT now() NOT NULL,
            CONSTRAINT "PK_2107093522d011af5866f5c7b8b" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_b5ad7953934db4391d65a852736" UNIQUE ("local_id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."article" (
            "id" uuid NOT NULL,
            "category" character varying NOT NULL,
            "subcategory" character varying NOT NULL,
            "article_heading" character varying NOT NULL,
            "article_text" character varying NOT NULL,
            "date_created" timestamp DEFAULT now() NOT NULL,
            "live" boolean NOT NULL,
            "lang" character varying NOT NULL,
            CONSTRAINT "PK_8a87b738cfed36d3df1ae29f6f8" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."avatar_messages" (
            "id" uuid NOT NULL,
            "content" character varying NOT NULL,
            "live" boolean NOT NULL,
            "lang" character varying NOT NULL,
            CONSTRAINT "PK_caa28febed46e7e9cc603ba6336" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."category" (
            "id" uuid NOT NULL,
            "title" character varying NOT NULL,
            "primary_emoji" character varying NOT NULL,
            "primary_emoji_name" character varying NOT NULL,
            "lang" character varying NOT NULL,
            CONSTRAINT "PK_6ff10a6bb5bac58bf412a00dc8e" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."did_you_know" (
            "id" uuid NOT NULL,
            "title" character varying NOT NULL,
            "content" character varying NOT NULL,
            "isAgeRestricted" boolean DEFAULT false,
            "live" boolean NOT NULL,
            "lang" character varying NOT NULL,
            CONSTRAINT "PK_32deb816574cba45fcf50f4b364" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE SEQUENCE help_center_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."help_center" (
            "id" integer DEFAULT nextval('help_center_id_seq') NOT NULL,
            "title" character varying NOT NULL,
            "caption" character varying NOT NULL,
            "contactOne" character varying NOT NULL,
            "contactTwo" character varying NOT NULL,
            "address" character varying NOT NULL,
            "website" character varying NOT NULL,
            "lang" character varying NOT NULL,
            CONSTRAINT "PK_b75170bf3fa752ce352ee24695e" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE SEQUENCE notification_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."notification" (
            "id" integer DEFAULT nextval('notification_id_seq') NOT NULL,
            "title" character varying NOT NULL,
            "content" character varying NOT NULL,
            "date_sent" character varying NOT NULL,
            "status" character varying NOT NULL,
            "lang" character varying NOT NULL,
            CONSTRAINT "PK_f8813f8c52a4bfe5ac252994970" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."oky_user" (
            "id" uuid NOT NULL,
            "date_of_birth" timestamp NOT NULL,
            "gender" character varying NOT NULL,
            "location" character varying NOT NULL,
            "country" character varying DEFAULT '00',
            "province" character varying DEFAULT '0',
            "store" json,
            "nameHash" character varying NOT NULL,
            "passwordHash" character varying NOT NULL,
            "memorableQuestion" character varying NOT NULL,
            "memorableAnswer" character varying NOT NULL,
            CONSTRAINT "PK_d6e1a97b8ab1251cdfa1e96cfae" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE SEQUENCE permanent_notification_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."permanent_notification" (
            "id" integer DEFAULT nextval('permanent_notification_id_seq') NOT NULL,
            "message" character varying NOT NULL,
            "isPermanent" boolean NOT NULL,
            "live" boolean NOT NULL,
            "lang" character varying NOT NULL,
            "versions" character varying NOT NULL,
            CONSTRAINT "PK_fec922ab39cf369a3dc40fd75cc" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE SEQUENCE privacy_policy_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."privacy_policy" (
            "id" integer DEFAULT nextval('privacy_policy_id_seq') NOT NULL,
            "json_dump" character varying NOT NULL,
            "timestamp" timestamp NOT NULL,
            "lang" character varying NOT NULL,
            CONSTRAINT "privacy_policy_pkey" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."quiz" (
            "id" uuid NOT NULL,
            "topic" character varying NOT NULL,
            "question" character varying NOT NULL,
            "option1" character varying NOT NULL,
            "option2" character varying NOT NULL,
            "option3" character varying NOT NULL,
            "right_answer" character varying NOT NULL,
            "wrong_answer_response" character varying NOT NULL,
            "right_answer_response" character varying NOT NULL,
            "isAgeRestricted" boolean DEFAULT false,
            "live" boolean NOT NULL,
            "date_created" timestamp DEFAULT now() NOT NULL,
            "lang" character varying NOT NULL,
            CONSTRAINT "PK_d431cff50cfee5d1bf2b4a78bd4" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."subcategory" (
            "id" uuid NOT NULL,
            "title" character varying NOT NULL,
            "parent_category" character varying NOT NULL,
            "lang" character varying NOT NULL,
            CONSTRAINT "PK_35c7f127f3a4e0e26e2f46746ff" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."suggestion" (
            "id" uuid NOT NULL,
            "name" character varying NOT NULL,
            "dateRec" character varying NOT NULL,
            "organization" character varying NOT NULL,
            "platform" character varying NOT NULL,
            "reason" character varying NOT NULL,
            "email" character varying NOT NULL,
            "status" character varying NOT NULL,
            "content" character varying NOT NULL,
            "lang" character varying NOT NULL,
            CONSTRAINT "PK_753936e5595250a6f94ef15273a" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."survey" (
            "id" uuid NOT NULL,
            "question" character varying NOT NULL,
            "option1" character varying NOT NULL,
            "option2" character varying NOT NULL,
            "option3" character varying NOT NULL,
            "option4" character varying NOT NULL,
            "option5" character varying NOT NULL,
            "response" character varying NOT NULL,
            "live" boolean NOT NULL,
            "date_created" timestamp DEFAULT now() NOT NULL,
            "lang" character varying NOT NULL,
            "is_multiple" boolean DEFAULT true,
            "isAgeRestricted" boolean DEFAULT false,
            CONSTRAINT "PK_6b410aa92ebd6c5e429c8c7555f" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."question" (
            "id" uuid NOT NULL,
            "question" character varying NOT NULL,
            "option1" character varying NOT NULL,
            "option2" character varying NOT NULL,
            "option3" character varying NOT NULL,
            "option4" character varying NOT NULL,
            "option5" character varying NOT NULL,
            "response" character varying NOT NULL,
            "is_multiple" boolean DEFAULT true,
            "next_question" json,
            "sort_number" character varying NOT NULL,
            "surveyId" uuid NOT NULL,
            CONSTRAINT "PK_6b410aa92ebd6c5e429c8c7555f" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE SEQUENCE terms_and_conditions_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."terms_and_conditions" (
            "id" integer DEFAULT nextval('terms_and_conditions_id_seq') NOT NULL,
            "json_dump" character varying NOT NULL,
            "timestamp" timestamp NOT NULL,
            "lang" character varying NOT NULL,
            CONSTRAINT "terms_and_conditions_pkey" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE SEQUENCE user_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;
    `)

    await queryRunner.query(`
        CREATE TABLE "oky_en"."user" (
            "id" integer DEFAULT nextval('user_id_seq') NOT NULL,
            "username" character varying NOT NULL,
            "password" character varying NOT NULL,
            "lang" character varying NOT NULL,
            "date_created" character varying DEFAULT 'now()' NOT NULL,
            "type" character varying NOT NULL,
            CONSTRAINT "PK_6cb7c14d28b65103f54c5b538f1" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `)

    await queryRunner.query(`
        CREATE VIEW "oky_en".answered_quizzes
            AS
            SELECT payload ->> 'id' as id, payload ->> 'question' as question, payload ->> 'isCorrect' as isCorrect, payload ->> 'answerID' as answerID, payload ->> 'answer' as answer, payload ->> 'utcDateTime' as date
            FROM oky_en.app_event
        WHERE type = 'ANSWER_QUIZ'
    `)

    await queryRunner.query(`
        CREATE or REPLACE VIEW "oky_en".answered_surveys
            AS
            SELECT payload ->> 'id' as id, payload ->> 'questions' as question,payload ->> 'answerID' as answerID, payload ->> 'answer' as answer, payload ->> 'utcDateTime' as date, payload ->> 'isCompleted' as isCompleted,  payload ->> 'isSurveyAnswered' as isSurveyAnswered, payload ->> 'user_id' as user_id, payload ->> 'questions' as questions
            FROM oky_en.app_event
        WHERE type = 'ANSWER_SURVEY'
    `)
  }
}
