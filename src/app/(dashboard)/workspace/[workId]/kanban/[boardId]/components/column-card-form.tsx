import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CardType } from "@/types/board";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { DetailedHTMLProps, HTMLAttributes, MutableRefObject, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const PriorityList = [
  { label: "Low", value: "low" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
];

type ColCardFormProps = {
  columnId: string;
  scrollableRef: MutableRefObject<HTMLDivElement | null>;
  addCard: (args: { cd: Omit<CardType, "id" | "creator">; columnId: string }) => void;
  containerAttr?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
};

const CardDTOSchema = z.object({
  title: z.string().min(1, { message: "required" }).max(20, { message: "Title should be less than 20 characters" }),
  description: z
    .string()
    .min(1, { message: "required" })
    .max(10000, { message: "Description can only have 10000 characters." }),
  priority: z.string().min(1, { message: "required" }),
});
type CardDTOSchemaInfer = z.infer<typeof CardDTOSchema>;

function ColumnCardForm({ containerAttr, addCard, columnId, scrollableRef }: ColCardFormProps) {
  const form = useForm<CardDTOSchemaInfer>({
    resolver: zodResolver(CardDTOSchema),
    mode: "onBlur",
    defaultValues: { title: "", description: "", priority: "" },
  });
  const clsBtn = useRef<HTMLButtonElement>(null);
  const onSubmit = (data: CardDTOSchemaInfer) => {
    console.log({ data });
    addCard({ cd: data, columnId });
    if (!scrollableRef.current) return;
    form.reset();
    clsBtn.current?.click();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
        <div {...containerAttr}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="enter title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-7"
                  >
                    {PriorityList.map((p) => (
                      <FormItem key={p.value} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={p.value} />
                        </FormControl>
                        <FormLabel className="font-normal">{p.label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
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
                <FormLabel>Card Description</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} placeholder="enter description" className="resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <div className="space-x-4 px-6 py-5">
            <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
              {!form.formState.isSubmitting ? "Create" : "Creating..."}
            </Button>
            <DialogClose asChild>
              <Button ref={clsBtn} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default ColumnCardForm;
