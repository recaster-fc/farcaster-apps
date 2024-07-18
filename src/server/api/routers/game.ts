import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const gameRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { token } = input;
      const fid = 3346; // parse from token
      const user = await ctx.db.query.users.findFirst({
        where: (item, { eq }) => eq(item.fid, fid),
      });

      if (!user) {
        throw new Error("User not found");
      }
      return user;
    }),
  getLeaderBoard: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findMany({
      orderBy: (item, { desc }) => desc(item.score),
      limit: 8,
    });
  }),
  updateScore: publicProcedure
    .input(
      z.object({
        fid: z.number(),
        score: z.number(),
        clicks: z.array(z.object({ x: z.number(), y: z.number() })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { fid, score, clicks } = input;
      // verify clicks
      if (score === 12) {
        await ctx.db
          .update(users)
          .set({
            score: sql`score + ${score}`,
          })
          .where(eq(users.fid, fid));
      }

      return {
        success: true,
      };
    }),
});
