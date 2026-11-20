import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/postSecurity";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { postId: string; commentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const comment = await prisma.comment.findUnique({
    where: { id: params.commentId },
  });

  if (!comment || comment.postId !== params.postId) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  if (
    comment.authorId !== session.user.id &&
    !isAdminEmail(session.user.email)
  ) {
    return NextResponse.json(
      {
        error: "You can only delete your own comments or as an administrator.",
      },
      { status: 403 }
    );
  }

  await prisma.comment.delete({ where: { id: params.commentId } });
  return NextResponse.json({ success: true });
}
