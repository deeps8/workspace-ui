"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, CircleX, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
];

const MemberSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const WorkspaceSchema = z.object({
  title: z.string().min(1, { message: "required" }).max(20, { message: "Title can only have 20 characters." }),
  description: z
    .string()
    .min(1, { message: "Required" })
    .max(100, { message: "Description can only have 100 characters." }),
  members: z.array(MemberSchema),
});

type WorkspaceSchemaInfer = z.infer<typeof WorkspaceSchema>;

export default function WorkspaceForm() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState(languages);
  const form = useForm<WorkspaceSchemaInfer>({
    resolver: zodResolver(WorkspaceSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      members: [{ label: "German", value: "de" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  function onSubmit(values: WorkspaceSchemaInfer) {
    console.log(values);
  }

  const searchMembers = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.trim();
    if (search) {
      setLang(languages.filter((l) => l.value.toLowerCase().match(search) || l.label.toLowerCase().match(search)));
      setOpen(true);
    } else {
      setLang([...languages]);
      setOpen(false);
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
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
          name="description"
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
                                const currIdx = field.value.findIndex((f) => f.value === language.value);
                                const selected = currIdx === -1 ? false : true;
                                return (
                                  <CommandItem
                                    value={language.label}
                                    key={language.value}
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
          <Button type="submit" disabled={!form.formState.isValid}>
            Create
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
