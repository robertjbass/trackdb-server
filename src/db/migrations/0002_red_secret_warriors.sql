CREATE TABLE IF NOT EXISTS "users" (
	"id" serial NOT NULL,
	"firstName" text,
	"lastName" text,
	"email" text,
	"password" text,
	"role" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
DROP TABLE "user";