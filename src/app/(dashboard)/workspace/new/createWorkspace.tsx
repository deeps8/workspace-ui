"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChangeEvent, useCallback, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Check, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewWorkspace } from "@/actions/workspace";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const MemberSchema = z.object({
  label: z.string(),
  value: z.object({ id: z.string(), email: z.string().email() }),
});

const WorkspaceSchema = z.object({
  name: z.string().min(1, { message: "required" }).max(20, { message: "Title can only have 20 characters." }),
  overview: z
    .string()
    .min(1, { message: "Required" })
    .max(100, { message: "Description can only have 100 characters." }),
  members: z.array(MemberSchema).min(1, { message: "There should be atleast one member added." }),
});

export type MemType = z.infer<typeof MemberSchema>;
export type WorkspaceSchemaInfer = z.infer<typeof WorkspaceSchema>;

export default function WorkspaceForm({ users }: { users: MemType[] }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<MemType[]>([]);

  const form = useForm<WorkspaceSchemaInfer>({
    resolver: zodResolver(WorkspaceSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      overview: "",
      members: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const Onsubmit = async (data: WorkspaceSchemaInfer) => {
    const res = await NewWorkspace(data);
    // console.log(res);
    if (res === undefined) {
      toast({
        variant: "default",
        title: "Success",
        description: "Created Workspace.",
        className: "bg-secondary text-white border-secondary",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: res.message,
      });
    }
  };

  const searchMembers = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.trim();
    if (search) {
      setLang(users.filter((l) => l.value.email.toLowerCase().match(search) || l.label.toLowerCase().match(search)));
      setOpen(true);
    } else {
      setLang([...users]);
      setOpen(false);
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(Onsubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="enter title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="overview"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} placeholder="describe your workspace" className="resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="members"
          render={({ field }) => {
            return (
              <>
                <FormItem>
                  <FormLabel>Members</FormLabel>
                  <Command className="overflow-visible">
                    <div>
                      <div className="flex flex-wrap space-x-4 p-3 border border-b-0 rounded-tl-md rounded-tr-md border-input">
                        {fields.length === 0 && <span className="text-sm">No Users are added</span>}
                        {fields.map((f, idx) => (
                          <RemoveBadge key={f.id} label={f.label} onRemove={() => remove(idx)} />
                        ))}
                      </div>
                      <Input
                        onChange={searchMembers}
                        onBlur={() => setOpen(false)}
                        onFocus={searchMembers}
                        type="search"
                        placeholder="search users here..."
                        className="rounded-tl-none rounded-tr-none"
                      />
                    </div>
                    <div className="relative">
                      {open ? (
                        <div className="mt-2 animate-in rounded-md border border-input fade-in-0 zoom-in-95 absolute top-0 z-10 w-full outline-none bg-popover text-popover-foreground">
                          {lang.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
                          <CommandList>
                            <CommandGroup className="max-h-52 overflow-auto">
                              {lang.map((language, idx) => {
                                const currIdx = field.value.findIndex((f) => f.value.id === language.value.id);
                                const selected = currIdx === -1 ? false : true;
                                return (
                                  <CommandItem
                                    value={language.label}
                                    key={language.value.id}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    onSelect={() => {
                                      if (!selected) append(language);
                                    }}
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", selected ? "opacity-100" : "opacity-0")} />
                                    {language.label}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </div>
                      ) : null}
                    </div>
                  </Command>
                  <FormMessage />
                </FormItem>
              </>
            );
          }}
        />
        <div className="space-x-4">
          <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
            {!form.formState.isSubmitting ? "Create" : "Creating..."}
          </Button>
          <Link href={"./"}>
            <Button variant={"outline"}>Cancel</Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}

type RemoveBadgeProps = {
  label: string;
  onRemove: () => void;
};
export function RemoveBadge({ label, onRemove }: RemoveBadgeProps) {
  return (
    <div className="inline-flex space-x-2 py-1 px-2 bg-muted text-sm rounded-full border border-transparent hover:border-primary">
      <span>{label}</span>
      <Button
        type="button"
        className="p-1 rounded-full w-auto h-auto focus:bg-destructive hover:bg-destructive hover:text-destructive-foreground"
        variant="outline"
        size="icon"
        onClick={onRemove}
      >
        <XIcon size={12} />
      </Button>
    </div>
  );
}
