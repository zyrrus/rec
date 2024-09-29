"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/app/_components/ui/select";
import { Separator } from "~/app/_components/ui/separator";
import { api } from "~/trpc/react";

export const CreateNewList = () => {
  const {
    isLoading,
    selectOptions,
    selectedListId,
    setSelectedListId,
    selectedList,
    handleSubmit,
    handleCancel,
  } = useListSelect();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start a new list</CardTitle>
        <CardDescription>
          Add a new list template to your profile to start sharing songs and
          albums with your friends.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          key={selectedListId} // Need this key to reset the select back to the placeholder on cancel
          value={selectedListId}
          onValueChange={setSelectedListId}
        >
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Select a list template" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <Loader2 className="mx-auto my-1 animate-spin text-stone-300 dark:text-stone-700" />
            ) : (
              selectOptions?.map(({ id, title }) => (
                <SelectItem key={id} value={`${id}`}>
                  {title}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {selectedList && (
          <>
            <Separator className="my-6" />
            <div className="space-y-1.5">
              <p className="font-semibold leading-none tracking-tight">
                {selectedList.title}
              </p>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {selectedList.description}
              </p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex-row-reverse gap-3">
        <Button disabled={!selectedList} onClick={handleSubmit}>
          Select
        </Button>
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

const useListSelect = () => {
  const utils = api.useUtils();
  const query = api.userLists.getUnusedListsByUser.useQuery();
  const { mutate } = api.userLists.selectNewList.useMutation({
    onSuccess: () => {
      setSelectedListId(undefined);
      void utils.userLists.getUnusedListsByUser.invalidate();
      void utils.userLists.getAllListsByUser.invalidate();
    },
  });

  const [selectedListId, setSelectedListId] = useState<string | undefined>();

  const handleCancel = () => setSelectedListId(undefined);
  const handleSubmit = () => {
    if (selectedListId === undefined) return;
    mutate({ list_template_id: Number(selectedListId) });
  };

  return {
    isLoading: query.isLoading,
    selectOptions: query.data,
    selectedListId,
    setSelectedListId,
    selectedList:
      !query.isLoading && selectedListId
        ? query.data?.find(({ id }) => `${id}` === selectedListId)
        : undefined,
    handleSubmit,
    handleCancel,
  };
};
