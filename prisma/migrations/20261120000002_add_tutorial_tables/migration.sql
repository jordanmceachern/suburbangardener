ALTER TABLE "posts" DROP COLUMN IF EXISTS "kind";

DROP TYPE IF EXISTS "PostKind";

CREATE TABLE "tutorials" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT,
  "contentHtml" TEXT NOT NULL,
  "coverUrl" TEXT,
  "youtubeUrl" TEXT,
  "category" TEXT NOT NULL DEFAULT 'General',
  "authorId" TEXT NOT NULL,
  "publishedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "tutorials_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tutorials_slug_key" ON "tutorials"("slug");
CREATE INDEX "tutorials_authorId_idx" ON "tutorials"("authorId");
CREATE INDEX "tutorials_publishedAt_idx" ON "tutorials"("publishedAt");

CREATE TABLE "tutorial_comments" (
  "id" TEXT NOT NULL,
  "tutorial_id" TEXT NOT NULL,
  "author_id" TEXT NOT NULL,
  "parent_id" TEXT,
  "bodyHtml" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "tutorial_comments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "tutorial_comments_tutorial_id_idx" ON "tutorial_comments"("tutorial_id");
CREATE INDEX "tutorial_comments_author_id_idx" ON "tutorial_comments"("author_id");
CREATE INDEX "tutorial_comments_parent_id_idx" ON "tutorial_comments"("parent_id");

CREATE TABLE "tutorial_comment_votes" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "comment_id" TEXT NOT NULL,
  "type" "VoteType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "tutorial_comment_votes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tutorial_comment_votes_user_id_comment_id_key" ON "tutorial_comment_votes"("user_id", "comment_id");
CREATE INDEX "tutorial_comment_votes_comment_id_idx" ON "tutorial_comment_votes"("comment_id");

ALTER TABLE "tutorials" ADD CONSTRAINT "tutorials_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tutorial_comments" ADD CONSTRAINT "tutorial_comments_tutorial_id_fkey" FOREIGN KEY ("tutorial_id") REFERENCES "tutorials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tutorial_comments" ADD CONSTRAINT "tutorial_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tutorial_comments" ADD CONSTRAINT "tutorial_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "tutorial_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tutorial_comment_votes" ADD CONSTRAINT "tutorial_comment_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tutorial_comment_votes" ADD CONSTRAINT "tutorial_comment_votes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "tutorial_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
