"use client";

import { DetailedHTMLProps, HTMLAttributes, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Kanban, Presentation, Workflow } from "lucide-react";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import { Input } from "../ui/input";
import { NewBoard } from "@/actions/board";
import { useToast } from "@/hooks/use-toast";

const BoardTypeList = [
  { value: "kanban", icon: Kanban, label: "Kanban" },
  { value: "whiteboard", icon: Presentation, label: "Whiteboard" },
  { value: "flow", icon: Workflow, label: "Flows" },
] as const;

const BoardSchema = z.object({
  name: z.string().min(1, { message: "required" }).max(20, { message: "Name should be less than 20 characters" }),
  type: z.string().min(1, { message: "required" }),
});

export type BoardSchemaInfer = z.infer<typeof BoardSchema>;
type CreateBoardFormProps = {
  containerAttr?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  spaceId: string;
};
export default function CreateBoardForm({ containerAttr, spaceId }: CreateBoardFormProps) {
  const { toast } = useToast();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const form = useForm<BoardSchemaInfer>({
    resolver: zodResolver(BoardSchema),
    mode: "onBlur",
    defaultValues: { type: "kanban", name: "" },
  });

  async function onSubmit(values: BoardSchemaInfer) {
    const res = await NewBoard({ ...values, space_id: spaceId });
    console.log({ res });
    if (res.ok) {
      toast({
        variant: "default",
        title: "Success",
        description: "Created Board.",
        className: "bg-secondary text-white border-secondary",
      });
      form.reset();
      closeBtn.current?.click();
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: res.message,
      });
    }
    return;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
        <div {...containerAttr}>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choose board type</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-3 gap-4 select-board">
                    {BoardTypeList.map((bt, idx) => (
                      <div className="board-type relative" key={bt.value}>
                        <input
                          {...field}
                          checked={field.value === bt.value}
                          value={bt.value}
                          autoFocus={idx == 0}
                          type="radio"
                          name="boardType"
                          id={bt.value}
                        />
                        <label htmlFor="kanban">
                          <div className="board-type-tile">
                            <bt.icon size={50} strokeWidth={1} className="mx-auto" />
                            {bt.label}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="enter name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-x-4 px-6 py-5 border-t">
          <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
            {!form.formState.isSubmitting ? "Create" : "Creating..."}
          </Button>
          <DialogClose asChild>
            <Button ref={closeBtn} variant={"outline"}>
              Cancel
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
}
