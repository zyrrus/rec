"use client";

import { Dialog } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/app/_components/ui/button";
import {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  useDialogControls,
} from "~/app/_components/ui/dialog";
import {
  contentTypes,
  curatedListSchema,
  type CuratedListSchema,
} from "~/server/api/shared/curator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { Textarea } from "~/app/_components/ui/textarea";
import { Checkbox } from "~/app/_components/ui/checkbox";
import { capitalize } from "~/app/_lib/strings";
import { monthNames } from "~/app/_lib/constants/months";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export const CreateCuratedList = () => {
  const [isOpen, onOpenChange] = useDialogControls();

  const utils = api.useUtils();
  const { mutate } = api.curator.createList.useMutation({
    onSuccess: (_, variables) => {
      toast.success(`Created new list: ${variables.title}`);
      onOpenChange(false);
      form.reset();
      void utils.curator.getAllLists.invalidate();
    },
  });

  const form = useForm<CuratedListSchema>({
    resolver: zodResolver(curatedListSchema),
    defaultValues: {
      title: "",
      description: "",
      length: 0,
      contentType: new Set(),
    },
  });

  const onSubmit = (values: CuratedListSchema) => {
    console.log("SUBMIT", values);
    mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Create new list</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create new curated list</DialogTitle>
              <DialogDescription>
                This will create a list template that all users will be able to
                see and use in their own profiles.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`${monthNames[new Date().getMonth()]} favorites`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the name of your new list.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description{" "}
                    <span className="font-normal text-stone-500">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Help users understand how to use your new list"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length</FormLabel>
                  <FormControl>
                    <Input placeholder="Length of list" {...field} />
                  </FormControl>
                  <FormDescription>
                    This how many albums and tracks can be added to the list.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Permitted content</FormLabel>
                    <FormDescription>
                      Select the type of content you want to allow in the list.
                    </FormDescription>
                  </div>
                  {contentTypes.map((item) => (
                    <FormItem
                      key={item}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value.has(item)}
                          onCheckedChange={(checked) => {
                            const updatedSet = new Set(field.value);

                            if (checked) {
                              updatedSet.add(item);
                            } else {
                              updatedSet.delete(item);
                            }

                            field.onChange(updatedSet);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {capitalize(item)}s
                      </FormLabel>
                    </FormItem>
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
