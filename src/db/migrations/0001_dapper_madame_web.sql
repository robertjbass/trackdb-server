ALTER TABLE "category" ADD COLUMN "weight" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "link" ADD COLUMN "weight" integer DEFAULT 1;