import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "./ui/textarea";
import { api } from "~/utils/api";
import React from "react";

export function PromptAddDialog({ token }: { token: string }) {
  const [open, setOpen] = React.useState(false);
  const mutation = api.editor.addPrompt.useMutation();
  const [name, setName] = React.useState("");
  const [prompt, setPrompt] = React.useState("");
  const utils = api.useUtils();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Prompt</Button>
      </DialogTrigger>
      <DialogContent className="w-4/5 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Prompt</DialogTitle>
          <DialogDescription>
            The prompt will save to your account and be available for future
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Translate"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Translate the following content into English."
              className="min-h-[150px]"
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            loading={mutation.isPending}
            onClick={() => {
              mutation.mutate(
                { name, prompt, token },
                {
                  onSuccess: () => {
                    void utils.editor.getPrompts.invalidate();
                    setName("");
                    setPrompt("");
                    setOpen(false);
                  },
                },
              );
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
