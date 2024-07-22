import { env } from "~/env";
import type { NextApiRequest, NextApiResponse } from "next";

import { NeynarAPIClient } from "@neynar/nodejs-sdk";

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
  console.log(messageBytes);
  const result = await neynarClient.validateFrameAction(messageBytes);
  if (result.valid) {
    const timestamp = Math.floor(
      new Date(result.action.timestamp).getTime() / 1000,
    );
    if (timestamp > new Date().getTime() / 1000 - 60) {
      console.log("Timestamp is valid");
      console.log(result.action.interactor);
    } else {
      res.status(404).json({
        type: "form",
        title: "Notcoin",
        url: "https://test.xx.com?token=ss",
      });
    }
  }

  res.status(200).json({
    type: "form",
    title: "Notcoin",
    url: "https://test.xxx.com?token=ss",
  });
}
