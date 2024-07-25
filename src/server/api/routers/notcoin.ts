import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { notcoin_users } from "~/server/db/schema";
import { decryptFid } from "~/utils/token";

export const notCoinRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { token } = input;
      const fid = decryptFid(token);
      const user = await ctx.db.query.notcoin_users.findFirst({
        where: (item, { eq }) => eq(item.fid, fid),
      });

      if (!user) {
        return null;
      }
      return user;
    }),
  getLeaderBoard: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.notcoin_users.findMany({
      orderBy: (item, { desc }) => desc(item.score),
      limit: 8,
    });
  }),
  updateScore: publicProcedure
    .input(
      z.object({
        token: z.string(),
        score: z.number(),
        clicks: z.array(z.object({ x: z.number(), y: z.number() })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { token, score, clicks } = input;
      const fid = decryptFid(token);
      // verify clicks
      if (score === 12) {
        await ctx.db
          .update(notcoin_users)
          .set({
            score: sql`score + ${score}`,
          })
          .where(eq(notcoin_users.fid, fid));
      }

      return {
        success: true,
      };
    }),
});
