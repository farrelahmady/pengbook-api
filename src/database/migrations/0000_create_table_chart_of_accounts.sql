CREATE TYPE "public"."chart_of_account_type" AS ENUM('1', '2', '3', '4', '5', '6');--> statement-breakpoint
CREATE TABLE "chart_of_accounts" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"description" varchar(100) NOT NULL,
	"code" varchar(15) NOT NULL,
	"level" integer NOT NULL,
	"type" chart_of_account_type NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "chart_of_accounts" ADD CONSTRAINT "chart_of_accounts_parent_id_chart_of_accounts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."chart_of_accounts"("id") ON DELETE cascade ON UPDATE cascade;