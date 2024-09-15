"use client";

import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { api } from "~/trpc/react";

export const CuratedList = () => {
  const query = api.curator.getAllLists.useQuery();

  const formatContentDescription = (contentType: string, length: number) => {
    let types = contentType.split(",");

    if (length > 1) {
      types = types.map((item) => `${item}s`);
    }

    return `${length} ${types.join("/")}`;
  };

  return (
    <>
      {query.data?.map((list) => (
        <Card key={list.id} className="">
          <CardHeader className="flex-row items-baseline justify-between gap-2 space-y-0">
            <CardTitle>{list.title}</CardTitle>
            <CardDescription>
              {formatContentDescription(list.contentType, list.length)}
            </CardDescription>
          </CardHeader>
          {list.description && <CardContent>{list.description}</CardContent>}
          <CardFooter className="flex-row-reverse gap-3">
            <Button>Update</Button>
            <Button variant="ghost">Delete</Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};
