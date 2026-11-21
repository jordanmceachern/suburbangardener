CREATE TYPE "PostKind" AS ENUM ('POST', 'TUTORIAL');

ALTER TABLE "posts"
ADD COLUMN "kind" "PostKind" NOT NULL DEFAULT 'POST';

CREATE INDEX "posts_kind_publishedAt_idx" ON "posts"("kind", "publishedAt");
