import { useCompletion } from "ai/react";
import { type GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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

export default function EditorPage({
  user,
  token,
}: {
  token: string;
  user?: { fid: number; username: string; avatar: string; displayName: string };
}) {
  const answerRef = useRef<null | HTMLDivElement>(null);
  // const scrollToAnswer = () => {
  //   if (answerRef.current !== null) {
  //     console.log("scrolling");
  //     answerRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

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

  const form = useForm({
    defaultValues: {
      text: "",
      prompt: "",
    },
  });
  useEffect(() => {
    if (completion?.length > 0 && answerRef.current !== null) {
      answerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [completion]);
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-white p-4 shadow-lg">
          <h1 className="text-2xl font-bold">
            Please use through Farcaster Client
          </h1>
        </div>
      </div>
    );
  }
  const answer = completion;

  return (
    <div className="mx-auto flex max-w-screen-md flex-col items-center justify-center pt-10">
      <div className="mb-4 flex w-3/4 flex-row items-center justify-start md:w-2/3">
        <img src={user.avatar} alt="Logo" className="h-12 w-12 rounded-full" />
        <div className="ml-2">
          <h1 className="font-medium">{user.displayName}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>
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
                  <PromptAddDialog token={token} />
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
                      key={0}
                      value={
                        "Translate the following text into English, without any unnecessary explanation."
                      }
                    >
                      Translate into English
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <div className="flex flex-row justify-center">
            <Button className="w-full" type="submit" loading={isLoading}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
      <output className="my-10 w-3/4 space-y-6 md:w-2/3">
        {answer && (
          <>
            <div>
              <h2 className="text-2xl font-bold">
                Your generated cast, click to cast
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
                              parent: "",
                              text: answer,
                              embeds: [],
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
  const params = ctx.query as { token?: string };
  if (!params?.token) {
    return {
      props: {
        user: null,
      },
    };
  }
  const token = params.token;
  const ssg = await getServerProxySSGHelpers();
  const user = await ssg.editor.getUser({ token: token });
  return {
    props: {
      token: token,
      user: user,
    },
  };
};
