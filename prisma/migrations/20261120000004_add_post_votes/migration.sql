CREATE TABLE IF NOT EXISTS "Vote" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "post_id" TEXT,
  "comment_id" TEXT,
  "type" "VoteType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Vote_userId_postId_key" ON "Vote"("user_id", "post_id") WHERE "post_id" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Vote_userId_commentId_key" ON "Vote"("user_id", "comment_id") WHERE "comment_id" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "Vote_postId_idx" ON "Vote"("post_id");
CREATE INDEX IF NOT EXISTS "Vote_commentId_idx" ON "Vote"("comment_id");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Vote_userId_fkey') THEN
    ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Vote_postId_fkey') THEN
    ALTER TABLE "Vote" ADD CONSTRAINT "Vote_postId_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Vote_commentId_fkey') THEN
    ALTER TABLE "Vote" ADD CONSTRAINT "Vote_commentId_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
