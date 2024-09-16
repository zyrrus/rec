"use client";

import { toast } from "sonner";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  useDialogControls,
} from "~/app/_components/ui/dialog";
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
        <Card key={list.id}>
          <CardHeader className="flex-row items-baseline justify-between gap-2 space-y-0">
            <CardTitle>{list.title}</CardTitle>
            <CardDescription>
              {formatContentDescription(list.contentType, list.length)}
            </CardDescription>
          </CardHeader>
          {list.description && <CardContent>{list.description}</CardContent>}
          <CardFooter className="flex-row-reverse gap-3">
            <UpdateButton />
            <DeleteButton id={list.id} />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

const UpdateButton = () => {
  // TODO:
  return <Button disabled>Update</Button>;
};

const DeleteButton = ({ id }: { id: number }) => {
  const [isOpen, onOpenChange] = useDialogControls();

  const utils = api.useUtils();
  const { mutate } = api.curator.deleteList.useMutation({
    onSuccess: () => {
      toast.success("Successfully deleted list.");
      onOpenChange(false);
      void utils.curator.getAllLists.invalidate();
    },
  });

  const handleDelete = () => {
    console.log("DELETE", id);
    mutate({ listId: id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            list.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
