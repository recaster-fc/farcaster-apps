import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prompts } from "~/server/db/schema";
import { decryptFid } from "~/utils/token";

export const editorRouter = createTRPCRouter({
  addPrompt: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        prompt: z.string().min(1),
        token: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, prompt, token } = input;
      const fid = decryptFid(token);
      if (!fid) {
        throw new Error("Invalid token");
      }
      await ctx.db.insert(prompts).values({
        fid,
        name,
        prompt,
      });
      return { success: true };
    }),

  getPrompts: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const { token } = input;
      const fid = decryptFid(token);
      const prompt = await ctx.db.query.prompts.findMany({
        columns: {
          id: true,
          fid: true,
          name: true,
          prompt: true,
        },
        where: (item, { eq }) => eq(item.fid, fid),
        orderBy: (item, { desc }) => desc(item.id),
      });
      return prompt;
    }),
  getUser: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { token } = input;
      const fid = decryptFid(token);
      const user = await ctx.db.query.editor_users.findFirst({
        where: (item, { eq }) => eq(item.fid, fid),
      });

      if (!user) {
        return null;
      }
      return user;
    }),
});
