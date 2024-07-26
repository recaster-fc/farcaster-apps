import { useCompletion } from "ai/react";
import { type GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PromptAddDialog } from "~/components/PromptAddDialog";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/utils/api";
import { getServerProxySSGHelpers } from "~/utils/ssg";

const EditorSchema = z.object({
  text: z.string().min(1),
  prompt: z.string().min(10),
});

export default function EditorPage({
  user,
  token,
  state,
}: {
  token: string;
  state: string;
  user?: { fid: number; username: string; avatar: string; displayName: string };
}) {
  const answerRef = useRef<null | HTMLDivElement>(null);

  const parsedCast = JSON.parse(
    decodeURIComponent(
      state ||
        "%7B%22cast%22%3A%7B%22text%22%3A%22%22%2C%22embeds%22%3A%5B%5D%7D%7D",
    ),
  ) as {
    cast: {
      text: string;
      embeds: string[];
      parent?: string;
    };
  };

  const { complete, completion, isLoading, handleSubmit } = useCompletion({
    api: "/api/completion",
    headers: {
      token: token,
    },
    onResponse: (res) => {
      console.log("pending");
    },
  });

  const { data } = api.editor.getPrompts.useQuery(
    { token: token },
    {
      enabled: !!token,
    },
  );

  const form = useForm<z.infer<typeof EditorSchema>>({
    resolver: zodResolver(EditorSchema),
    defaultValues: {
      text: parsedCast.cast.text,
      prompt: "",
    },
  });
  useEffect(() => {
    if (completion?.length > 0 && answerRef.current !== null) {
      answerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [completion]);
  const answer = completion;

  return (
    <div className="mx-auto flex max-w-screen-md flex-col items-center justify-center pt-10">
      <NextSeo
        title="Cast AI Editor"
        description="use AI to help you create cast"
      />
      {user && (
        <div className="mb-4 flex w-3/4 flex-row items-center justify-start md:w-2/3">
          <img
            src={user.avatar}
            alt="Logo"
            className="h-12 w-12 rounded-full"
          />
          <div className="ml-2">
            <h1 className="font-medium">{user.displayName}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            void complete(`${data.prompt}: ${data.text}`);
            handleSubmit();
          })}
          className="w-3/4 space-y-6 md:w-2/3"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Cast Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your cast here."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center justify-between">
                  <FormLabel className="text-base">Choose Prompt</FormLabel>
                  {user ? (
                    <PromptAddDialog token={token} />
                  ) : (
                    <Button variant={"secondary"} disabled>
                      Add Prompt
                    </Button>
                  )}
                </div>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a prompt" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data?.map((prompt) => (
                      <SelectItem key={prompt.id} value={prompt.prompt}>
                        {prompt.name}
                      </SelectItem>
                    ))}
                    <SelectItem
                      key="-1"
                      value={
                        "Translate the following text into concise English, without any unnecessary explanation."
                      }
                    >
                      Translate into English
                    </SelectItem>
                    <SelectItem
                      key="-2"
                      value={
                        "Rewrite following text to be clearer, easier to comprehend, and less confusing.Only give me the output and nothing else. "
                      }
                    >
                      Simplify Language
                    </SelectItem>
                    <SelectItem
                      key="-3"
                      value={
                        "Rewrite following text to be no more than half the number of characters while keeping the core meaning the same. Output only the rewritten text, without any quotes or other formatting."
                      }
                    >
                      Make shorter
                    </SelectItem>
                    <SelectItem
                      key="-4"
                      value={
                        "Please rewrite following text to be twice as long, while keeping the core meaning the same. Do not add any completely new information, ideas or opinions."
                      }
                    >
                      Make longer
                    </SelectItem>
                    <SelectItem
                      key="-5"
                      value={
                        "PHelp me generate a post based on the following topics or keywords, no longer than 300 words."
                      }
                    >
                      Generate Cast
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <div className="flex flex-row justify-center">
            {user ? (
              <Button className="w-full" type="submit" loading={isLoading}>
                Generate
              </Button>
            ) : (
              <Button className="w-full" disabled>
                Please open with Farcaster client
              </Button>
            )}
          </div>
        </form>
      </Form>
      <output className="my-10 w-3/4 space-y-6 md:w-2/3">
        {answer && (
          <>
            <div>
              <h2 className="text-2xl font-bold">
                Generated cast, click to use:
              </h2>
            </div>
            <div className="flex flex-col space-y-8">
              <div className="cursor-copy rounded-xl border p-4 shadow-md transition hover:bg-secondary">
                <div
                  className="whitespace-pre-wrap text-left"
                  ref={answerRef}
                  onClick={() => {
                    if (!isLoading) {
                      window.parent.postMessage(
                        {
                          type: "createCast",
                          data: {
                            cast: {
                              parent: parsedCast.cast?.parent,
                              text: answer,
                              embeds: parsedCast.cast.embeds,
                            },
                          },
                        },
                        "*",
                      );
                    }
                  }}
                >
                  {answer}
                </div>
              </div>
            </div>
          </>
        )}
      </output>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const params = ctx.query as { token?: string; state?: string };
  if (!params?.token) {
    return {
      props: {
        user: null,
      },
    };
  }
  const token = params.token;
  const state = params.state;
  const ssg = await getServerProxySSGHelpers();
  const user = await ssg.editor.getUser({ token: token });
  return {
    props: {
      token: token,
      state: state,
      user: user,
    },
  };
};
