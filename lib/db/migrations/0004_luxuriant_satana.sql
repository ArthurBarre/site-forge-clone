CREATE TABLE "vercel_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"v0_chat_id" varchar(255) NOT NULL,
	"vercel_project_id" varchar(255) NOT NULL,
	"vercel_project_name" varchar(255) NOT NULL,
	"deploy_url" varchar(500),
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"last_deployed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vercel_projects_v0_chat_id_unique" UNIQUE("v0_chat_id")
);
