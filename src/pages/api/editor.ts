import { env } from "~/env";
import * as crypto from "crypto-js";

import type { NextApiRequest, NextApiResponse } from "next";

import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { db } from "~/server/db";
import { editor_users } from "~/server/db/schema";

function encryptFid(fid: number) {
  const encrypted = crypto.AES.encrypt(
    fid.toString(),
    env.SECRERT_KEY,
  ).toString();
  return encrypted.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
const neynarClient = new NeynarAPIClient(env.NEYNAR_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
}
