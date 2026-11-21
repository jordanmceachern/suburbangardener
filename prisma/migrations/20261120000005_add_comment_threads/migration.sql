ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "parent_id" TEXT;
CREATE INDEX IF NOT EXISTS "comments_parent_id_idx" ON "comments"("parent_id");
ALTER TABLE "comments" DROP CONSTRAINT IF EXISTS "comments_parent_id_fkey";
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey"
  FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tutorial_comments" ADD COLUMN IF NOT EXISTS "parent_id" TEXT;
CREATE INDEX IF NOT EXISTS "tutorial_comments_parent_id_idx" ON "tutorial_comments"("parent_id");
ALTER TABLE "tutorial_comments" DROP CONSTRAINT IF EXISTS "tutorial_comments_parent_id_fkey";
ALTER TABLE "tutorial_comments" ADD CONSTRAINT "tutorial_comments_parent_id_fkey"
  FOREIGN KEY ("parent_id") REFERENCES "tutorial_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
