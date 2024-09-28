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
  const query = api.curator.getAllLists.useQuery();

  const [selectedListId, setSelectedListId] = useState<string | undefined>();
  const handleCancel = () => setSelectedListId(undefined);
  const handleSubmit = () => {
    // TODO: Run mutation
    console.log("SELECTED", selectedListId);

    setSelectedListId(undefined);
  };

  const selectedList =
    !query.isLoading && selectedListId
      ? query.data?.find(({ id }) => `${id}` === selectedListId)
      : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start a new list</CardTitle>
        <CardDescription>
          Choose a list template created by the{" "}
          <span className="font-semibold">rec</span> team, add songs and albums,
          and share with friends.
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
            {query.isLoading ? (
              <Loader2 className="mx-auto my-1 animate-spin text-stone-300 dark:text-stone-700" />
            ) : (
              query.data?.map(({ id, title }) => (
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
