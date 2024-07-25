import { env } from "~/env";

import type { NextApiRequest, NextApiResponse } from "next";

import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { db } from "~/server/db";
import { editor_users } from "~/server/db/schema";
import { encryptFid } from "~/utils/token";

const neynarClient = new NeynarAPIClient(env.NEYNAR_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = req.body as {
      untrustedData: {
        fid: number;
        url: string;
        messageHash: string;
        timestamp: number;
        network: number;
        buttonIndex: number;
        state: string;
      };
      trustedData: {
        messageBytes: string;
      };
    };
    const messageBytes = data.trustedData.messageBytes;
    const result = await neynarClient.validateFrameAction(messageBytes);
    if (result.valid) {
      const timestamp = Math.floor(
        new Date(result.action.timestamp).getTime() / 1000,
      );
      if (timestamp > new Date().getTime() / 1000 - 60) {
        const token = encryptFid(result.action.interactor.fid);
        await db
          .insert(editor_users)
          .values({
            fid: result.action.interactor.fid,
            username: result.action.interactor.username ?? "",
            displayName: result.action.interactor.display_name ?? "",
            avatar: result.action.interactor.pfp_url ?? "",
          })
          .onConflictDoNothing();
        res.status(200).json({
          type: "form",
          title: "Cast AI Editor",
          url: `https://apps.recaster.org/editor?token=${token}`,
        });
        return;
      }
    }
    res.status(401);
  } else {
    res.status(200).json({
      type: "composer",
      name: "Cast AI Editor",
      icon: "pencil",
      description: "Use AI to help you create cast",
      aboutUrl: "https://apps.recaster.org/",
      imageUrl: "https://apps.recaster.org/_images/editor.png",
      action: {
        type: "post",
      },
    });
  }
}
