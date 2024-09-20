"use client";

import { toast } from "sonner";
import { CuratedListCard } from "~/app/_components/curated-list-card";
import { Button } from "~/app/_components/ui/button";
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

  return query.data?.map((list) => (
    <CuratedListCard
      key={list.id}
      {...list}
      actions={
        <>
          <UpdateButton />
          <DeleteButton id={list.id} />
        </>
      }
    />
  ));
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
