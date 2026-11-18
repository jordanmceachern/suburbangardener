jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status ?? 200,
      json: async () => body,
    })),
  },
}));

jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("../src/lib/auth", () => ({ authOptions: {} }));
jest.mock("../src/lib/prisma", () => ({
  prisma: {
    post: { findUnique: jest.fn() },
    vote: { upsert: jest.fn(), count: jest.fn(), findUnique: jest.fn() },
  },
}));

const { GET, POST } = require("../src/app/api/posts/[postId]/vote/route");
const { getServerSession } = require("next-auth");
const { prisma } = require("../src/lib/prisma");

const params = { params: { postId: "post-1" } };
const voteRequest = (type: string) => ({ json: async () => ({ type }) }) as any;

describe("post vote route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prisma.post.findUnique.mockResolvedValue({ id: "post-1" });
    prisma.vote.count.mockImplementation(
      async ({ where }: { where: { type: string } }) =>
        where.type === "UP" ? 3 : 1
    );
  });

  it("rejects unauthenticated votes", async () => {
    getServerSession.mockResolvedValue(null);

    const response = await POST(voteRequest("UP"), params);

    expect(response.status).toBe(401);
    expect(prisma.vote.upsert).not.toHaveBeenCalled();
  });

  it("stores a single vote per user and post, replacing the previous direction", async () => {
    getServerSession.mockResolvedValue({ user: { id: "user-1" } });
    prisma.vote.findUnique.mockResolvedValue({ type: "DOWN" });

    const response = await POST(voteRequest("DOWN"), params);

    expect(prisma.vote.upsert).toHaveBeenCalledTimes(1);
    expect(prisma.vote.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_PostId: { userId: "user-1", PostId: "post-1" } },
        update: { type: "DOWN" },
      })
    );
    expect(await response.json()).toEqual({
      upvotes: 3,
      downvotes: 1,
      userVote: "DOWN",
    });
  });

  it("returns counts without a user vote for signed-out visitors", async () => {
    getServerSession.mockResolvedValue(null);

    const response = await GET({} as any, params);

    expect(prisma.vote.findUnique).not.toHaveBeenCalled();
    expect(await response.json()).toEqual({
      upvotes: 3,
      downvotes: 1,
      userVote: null,
    });
  });
});

export {};
