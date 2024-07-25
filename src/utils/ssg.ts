import { createInnerTRPCContext } from "~/server/api/trpc";
import { createCaller } from "~/server/api/root";

export const getServerProxySSGHelpers = async () => {
  const context = createInnerTRPCContext({});
  const caller = createCaller(context);
  return caller;
};
