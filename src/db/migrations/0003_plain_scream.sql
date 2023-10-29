CREATE TABLE IF NOT EXISTS "user" (
	"id" serial NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text,
	"password" text,
	"role" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
DROP TABLE "users";